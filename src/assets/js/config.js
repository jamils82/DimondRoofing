"use strict";
var cds = cds || {};

// need to add annotations (figure out how to handle cases where the annotations collide - see parallel)
// need to change annotation offset individually by angle
// need to set negative value for annotation offset
// need to show square bracket at right angles
// add softedge extensions as a separate points array (test on 2d first)

cds.fletcher = {
    // drawing data
    points: [],
    annotAngles: [],
    annotLines: [],

    // viewer elements
    viewerContainer3D: "cds-viewer-container-3d",
    viewerContainer2D: "cds-viewer-container-2d",
    viewerControls: "viewer-controls",
    view3DSelector: "3d-view-selector",
    view2DSelector: "2d-view-selector",

    // 3d canvas settings
    extrudeProperties: {
        steps: 200,
        bevelEnabled: false,
        depth: 200
    },
    outlineProperties: {
        color: 0x000000,
        transparent: true,
        opacity: 0
    },
    lineThickness: 2,
    extensionThickness: 1,
    scene: null,
    webGLRenderer: null,
    camera: null,
    controls: null,
    topColor: "#000",
    bottomColor: "#000",

    // 2d canvas settings
    lineProperties: {
        "dimensionUnit": "mm",
        "dimensionWidth": 500,
        "showGrid": false,
        "drawingLineWidth": 2,
        "drawingLineCap": "butt",
        "drawingColor": "#000",
        "annotationFont": "14px sans-serif",
        "annotationColor": "#444",
        "angleAnnotationOffset": 30.0
    },

    // render html, set up 3d scene, initiate 2d
    init: function (container) {
        this.renderHTML(container);

        // init 3d
        let viewer = document.getElementById(this.viewerContainer3D);
        if (viewer) {
            // create a scene, that will hold all our elements such as objects, cameras and lights.
            this.scene = new THREE.Scene();

            // create a render and set the size
            this.webGLRenderer = new THREE.WebGLRenderer();
            this.webGLRenderer?.setClearColor(0xffffff, 1);
            this.webGLRenderer?.setSize(viewer.offsetWidth - 2, viewer.offsetHeight - 2);
            this.webGLRenderer.shadowMapEnabled = true;

            // create lights
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(-1, 1, 0)
            this.scene.add(directionalLight);
            const ambLight = new THREE.AmbientLight(0x404040, 2.5); // soft white light
            this.scene.add(ambLight);

            // create camera, position and point the camera to the center of the scene
            this.camera = new THREE.PerspectiveCamera(45, viewer.offsetWidth / viewer.offsetHeight, 0.1, 1000);
            this.camera.position.x = -20;
            this.camera.position.y = 60;
            this.camera.position.z = 60;
            this.camera.lookAt(new THREE.Vector3(20, 20, 0));

            // limit rotation
            this.controls = new THREE.OrbitControls(this.camera, this.webGLRenderer?.domElement);
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI / 2;

            // add the output of the renderer to the html element
            viewer.appendChild(this.webGLRenderer?.domElement);
            this.renderScene();
        }

        // init 2d
        cds.d2d.init(this.lineProperties);

        // toggle canvas visibility
        this.toggleView();
    },

    // render 3d viewer, 2d viewer, viewer controls
    renderHTML: function (container) {
        let e = document.getElementById(container);
        if (e) {
            let div = document.createElement("div");
            e.appendChild(div);
            div.setAttribute("id", this.viewerContainer3D);
            div = document.createElement("div");
            e.appendChild(div);
            div.setAttribute("id", this.viewerContainer2D);
            let canvas = document.createElement("canvas");
            div.appendChild(canvas);
            canvas.setAttribute("id", "cds-canvas");
            canvas.width = div.offsetWidth - 2;
            canvas.height = div.offsetHeight - 2;
            div = document.createElement("div");
            e.appendChild(div);
            div.setAttribute("id", this.viewerControls);
            let label = document.createElement("label");
            div.appendChild(label);
            label.appendChild(document.createTextNode("2D"));
            let input = document.createElement("input");
            div.appendChild(input);
            input.setAttribute("id", this.view2DSelector);
            input.type="radio";
            input.value="2d";
            input.name = "view-selector";
            input.checked = "checked";
            input.onchange = function () {
                cds.fletcher.toggleView();
            }
            label = document.createElement("label");
            div.appendChild(label);
            label.appendChild(document.createTextNode("3D"));
            input = document.createElement("input");
            div.appendChild(input);
            input.setAttribute("id", this.view3DSelector);
            input.type="radio";
            input.value="3d";
            input.name = "view-selector";
            input.onchange = function () {
                cds.fletcher.toggleView();
            }
        }
    },

    // convert user inputs passed from cpq to points array
    load: function (o) {
        // ---- Template Types ----
        // ridge - upside V, orient around pitch angle
        // valley - V, orient around pitch angle
        // parallel - two vertical lines, connecting segment(s) between them
        // barge - based around one vertical line
        // basic - first segment is horizontal
        let points = [];
        let annotAngles = [];
        let annotLines = [];
        let type = (o.template) ? o.template : "basic"; // if no template is specified then default to basic

        // for error reporting
        let hasSegment = false;
        let hasVertice = false;

        // get color
        if (o.colour) {
            if (o.colouredSide === "topright") {
                this.topColor = o.color;
            } else {
                this.bottomColor = o.color;
            }
        }

        // get angle at ridge/valley
        let angle = 0;
        if (o.pitch && o.pitch.requestedPitch in pitchMap && o.pitch.pitchType in pitchMap[o.pitch.requestedPitch]) {
            angle = pitchMap[o.pitch.requestedPitch][o.pitch.pitchType];
        }
        // get difference between angle from payload and calculated angle
        let angleModifier = 0;
        if (o.pitch && o.pitch.originalPitch in pitchMap && o.pitch.pitchType in pitchMap[o.pitch.originalPitch]) {
            let a = pitchMap[o.pitch.originalPitch][o.pitch.pitchType];
            angleModifier = (a - angle) / 2;
        }

        // iterate over aspects
        if (o.aspects) {
            // find orient aspect and orient this segment to the canvas
            let orientIndex = 0;
            let orientation = 0;
            for (let i = 0; i < o.aspects.length; i++) {
                let a = o.aspects[i];
                if (a.orientationAspect && a.aspectType === "segment" && a.value) {
                    orientIndex = i;
                    orientation = this.getOrientation(type, angle, true);
                    points.push({"type": "point", "x": 0, "y": 0});
                    points.push({
                        "type": "point",
                        "x": a.value * Math.cos(orientation * Math.PI / 180),
                        "y": a.value * Math.sin(orientation * Math.PI / 180)
                    });
                    hasSegment = true;
                    // angles.push(orientation);
                    break;
                }
            }

            // add points to the left of oriented aspect
            let pOrientation = orientation; // set previous orientation
            let x = 0;
            let y = 0;
            for (let i = orientIndex - 1; i > -1; i--) {
                let a = o.aspects[i];
                // modify orientation of next segment
                if (a.aspectType === "vertice" && a.value) {
                    pOrientation -= this.getOrientedAngle(a.value);
                    hasVertice = true;

                // add next point
                } else if (a.aspectType === "segment" && a.value) {
                    x -= a.value * Math.cos(pOrientation * Math.PI / 180);
                    y -= a.value * Math.sin(pOrientation * Math.PI / 180);
                    points.unshift({"type": "point", "x": x, "y": y});
                    hasSegment = true;
                    // angles.unshift(pOrientation);
                }
            }

            // add points to the right of the oriented aspect
            let nOrientation = orientation; // set next orientation
            x = points[points.length - 1].x;
            y = points[points.length - 1].y;
            for (let i = orientIndex + 1; i < o.aspects.length; i++) {
                let a = o.aspects[i];
                // handle additional orient aspects
                if (a.orientationAspect) {
                    // modify angle
                    if (a.aspectType === "vertice" && a.value) {
                        a.value = angle;
                        hasVertice = true;

                    // get orientation and add next point
                    } else if (a.aspectType === "segment" && a.value) {
                        nOrientation = this.getOrientation(type, angle, false);
                        x += a.value * Math.cos(nOrientation * Math.PI / 180);
                        y += a.value * Math.sin(nOrientation * Math.PI / 180);
                        points.push({"type": "point", "x": x, "y": y});
                        hasSegment = true;
                        // angles.push(nOrientation);
                    }

                // get orientation of next segment
                } else if (a.aspectType === "vertice" && a.value) {
                    // modify non-orientationAspect angle adjacent to ridge or valley segments
                    if (type === "ridge" || type === "valley") {
                        // angle after first segment
                        if (i === orientIndex + 1) {
                            a.value -= angleModifier;
                        // angle before next segment
                        } else if (i + 1 < o.aspects.length && o.aspects[i + 1].aspectType === "segment"
                                && o.aspects[i + 1].orientationAspect) {
                            a.value -= angleModifier;
                        }
                    }
                    nOrientation += this.getOrientedAngle(a.value);
                    hasVertice = true;

                // add next point
                } else if (a.aspectType === "segment" && a.value) {
                    if (a.subType === "semi-circle") {
                        points.push(this.getCurvePoints(nOrientation, a.value, x, y));
                        // // get first control point for bezier curve
                        // let x1 = x + a.value * 2/3 * Math.cos(nOrientation * Math.PI / 180);
                        // let y1 = y + a.value * 2/3 * Math.sin(nOrientation * Math.PI / 180);
                        // // get arc centerpoint
                        // let mx = a.value * 0.5 * Math.cos((nOrientation - 90) * Math.PI / 180);
                        // let my = a.value * 0.5 * Math.sin((nOrientation - 90) * Math.PI / 180);
                        // // get end point
                        x += a.value * Math.cos((nOrientation - 90) * Math.PI / 180);
                        y += a.value * Math.sin((nOrientation - 90) * Math.PI / 180);
                        // // get second control point for bezier curve
                        // let x2 = x + a.value * 2/3 * Math.cos(nOrientation * Math.PI / 180);
                        // let y2 = y + a.value * 2/3 * Math.sin(nOrientation * Math.PI / 180);
                        // points.push({
                        //     "type": "curve",
                        //     "x": x,
                        //     "y": y,
                        //     "cpx1": x1,
                        //     "cpy1": y1,
                        //     "cpx2": x2,
                        //     "cpy2": y2,
                        //     "mx": mx,
                        //     "my": my,
                        //     "r": a.value * 0.5
                        // });
                    } else {
                        x += a.value * Math.cos(nOrientation * Math.PI / 180);
                        y += a.value * Math.sin(nOrientation * Math.PI / 180);
                        points.push({"type": "point", "x": x, "y": y});
                    }
                    hasSegment = true;
                    // angles.push(nOrientation);
                }
            }

            // add extensions
            let angleAdj = 0; // adjust index of angle annotations based on number of points in first extension
            if (o.extensions) {
                for (let i = 0; i < o.extensions.length; i++) {
                    if (o.extensions[i].extensionType && o.extensions[i].values) {
                        if (o.extensions[i].extensionType === "leading") {
                            if (o.extensions[i].values.type === "crush") {
                                // get starting point
                                let x = points[0].x;
                                let y = points[0].y;
                                // allowance is diameter of curve
                                let d = this.lineThickness;
                                if (o.extensions[i].values.allowance) {
                                    d += o.extensions[i].values.allowance;
                                }
                                // replace existing point with curve
                                points[0] = this.getCurvePoints(pOrientation, d, x, y, true);
                                // get add new end point
                                x += d * Math.cos((pOrientation - 90) * Math.PI / 180);
                                y += d * Math.sin((pOrientation - 90) * Math.PI / 180);
                                points.unshift({"type": "point", "x": x, "y": y});
                                angleAdj++;
                                // value is length after curve
                                if (o.extensions[i].values.value) {
                                    x += o.extensions[i].values.value * Math.cos(pOrientation * Math.PI / 180);
                                    y += o.extensions[i].values.value * Math.sin(pOrientation * Math.PI / 180);
                                    points.unshift({"type": "point", "x": x, "y": y});
                                    angleAdj++;
                                }
                            }

                        } else if (o.extensions[i].extensionType === "trailing") {
                            if (o.extensions[i].values.type === "crush") {
                                // get starting point
                                let x = points[points.length - 1].x;
                                let y = points[points.length - 1].y;
                                // allowance is diameter of curve
                                let d = this.lineThickness;
                                if (o.extensions[i].values.allowance) {
                                    d += o.extensions[i].values.allowance;
                                }
                                points.push(this.getCurvePoints(nOrientation, d, x, y));
                                // get new end point
                                x += d * Math.cos((nOrientation - 90) * Math.PI / 180);
                                y += d * Math.sin((nOrientation - 90) * Math.PI / 180);
                                // value is length after curve
                                if (o.extensions[i].values.value) {
                                    nOrientation += 180;
                                    x += o.extensions[i].values.value * Math.cos(nOrientation * Math.PI / 180);
                                    y += o.extensions[i].values.value * Math.sin(nOrientation * Math.PI / 180);
                                    points.push({"type": "point", "x": x, "y": y});
                                }
                            }
                        }
                    }
                }
            //     extensionType: leading/trailing
            //     values:
            //         type: softedge/crush
            //         allowance: For an open crush will be the open gap (not length!). For Flashguard will be the overlap between flashing and flashguard
            //         value: For flashguard - this will be the width of the material - in the 3D render, the flashguard will stick out (this number - allowance) past the edge of the flashing.
            }

            // find lines and angles to annotate
            let segment = 0;
            let pSegment = -1;
            let aspectAngle = [];
            for (let i = 0; i < o.aspects.length; i++) {
                let a = o.aspects[i];
                if (a.aspectType === "segment") {
                    // match angles of two orientationAspect for ridge and valley
                    if (a.orientationAspect && (type === "ridge" || type === "valley")) {
                        aspectAngle.push(segment + angleAdj);
                        if (aspectAngle.length === 2) {
                            annotAngles.push(aspectAngle);
                        }

                    // // match all angles of non-orientationAspect
                    // // (this does not catch angles on the non-aspect side of orientationAspect segments)
                    // } else {
                    //     if (pSegment !== -1 && pSegment === segment - 1) {
                    //         annotAngles.push([pSegment, segment]);
                    //     }
                    //     pSegment = segment;
                    }
                    // add annotation for all segment lengths
                    segment++;
                }
            }

            // // reset points array to always start at [0, 0]
            // let xStart = 0, yStart = 0;
            // for (let i = 0; i < points.length; i++) {
            //     if (i === 0) {
            //         xStart = points[i].x;
            //         yStart = points[i].y;
            //         points[i].x = 0;
            //         points[i].y = 0;
            //     } else {
            //         points[i].x -= xStart;
            //         points[i].y -= yStart;
            //         if (points[i].type === "curve") {
            //             points[i].cpx1 -= xStart;
            //             points[i].cpy1 -= yStart;
            //             points[i].cpx2 -= xStart;
            //             points[i].cpy2 -= yStart;
            //             points[i].mx -= xStart;
            //             points[i].my -= yStart;
            //         }
            //     }
            // }

            // check for errors
            if (!hasSegment) {
                return {
                    "status": "error",
                    "errorText": "No segment aspects",
                    "aspects": o.aspects
                }
            } else if (!hasVertice) {
                return {
                    "status": "error",
                    "errorText": "No vertice aspects",
                    "aspects": o.aspects
                }
            }

            this.points = points;
            this.annotAngles = annotAngles;
            this.annotLines = annotLines;
            //console.log(this.points);
            //console.log(o.aspects);
            this.toggleView();
            return {
                "status": "success",
                "errorText": null,
                "aspects": o.aspects
            }

        } else {
            return {
                "status": "error",
                "errorText": "No aspects provided",
                "aspects": []
            }
        }
    },

    // get orientation relative to canvas of first oriented segment
    getOrientation: function (type, angle, isFirstSegment) {
        if (isFirstSegment) {
            switch (type) {
                case "ridge":
                    return 90 - angle / 2;
                case "valley":
                    return angle / 2 - 90;
                case "parallel":
                    return 90;
                case "barge":
                    return 90;
                default:
                    return 0;
            }
        } else {
            switch (type) {
                case "ridge":
                    return angle / 2 - 90;
                case "valley":
                    return 90 - angle / 2;
                case "parallel":
                    return -90;
                default:
                    return 0;
            }
        }
    },

    // angles are given for two vectors in opposite directions
    // reverse direction of angle to get the change of direction
    // between two vectors going in the same direction
    getOrientedAngle: function (angle) {
        if (angle < 0) {
            return angle + 180;
        } else {
            return angle - 180;
        }
    },

    getCurvePoints: function (angle, diameter, xStart, yStart, isPrevious) {
        // add points in reverse order for curves on the left side
        if (isPrevious) {
            // get first control point for bezier curve
            let x1 = xStart + diameter * 2/3 * Math.cos((angle + 180) * Math.PI / 180);
            let y1 = yStart + diameter * 2/3 * Math.sin((angle + 180) * Math.PI / 180);
            // get arc centerpoint
            let mx = xStart + diameter * 0.5 * Math.cos((angle + 270) * Math.PI / 180);
            let my = yStart + diameter * 0.5 * Math.sin((angle + 270) * Math.PI / 180);
            // get end point
            let x = xStart + diameter * Math.cos((angle + 270) * Math.PI / 180);
            let y = yStart + diameter * Math.sin((angle + 270) * Math.PI / 180);
            // get second control point for bezier curve
            let x2 = x + diameter * 2/3 * Math.cos((angle + 180) * Math.PI / 180);
            let y2 = y + diameter * 2/3 * Math.sin((angle + 180) * Math.PI / 180);
            return {
                "type": "curve",
                "x": xStart,
                "y": yStart,
                "cpx1": x2,
                "cpy1": y2,
                "cpx2": x1,
                "cpy2": y1,
                "mx": mx,
                "my": my,
                "r": diameter * 0.5
            };
        }
        // get first control point for bezier curve
        let x1 = xStart + diameter * 2/3 * Math.cos(angle * Math.PI / 180);
        let y1 = yStart + diameter * 2/3 * Math.sin(angle * Math.PI / 180);
        // get arc centerpoint
        let mx = xStart + diameter * 0.5 * Math.cos((angle - 90) * Math.PI / 180);
        let my = yStart + diameter * 0.5 * Math.sin((angle - 90) * Math.PI / 180);
        // get end point
        let x = xStart + diameter * Math.cos((angle - 90) * Math.PI / 180);
        let y = yStart + diameter * Math.sin((angle - 90) * Math.PI / 180);
        // get second control point for bezier curve
        let x2 = x + diameter * 2/3 * Math.cos(angle * Math.PI / 180);
        let y2 = y + diameter * 2/3 * Math.sin(angle * Math.PI / 180);
        return {
            "type": "curve",
            "x": x,
            "y": y,
            "cpx1": x1,
            "cpy1": y1,
            "cpx2": x2,
            "cpy2": y2,
            "mx": mx,
            "my": my,
            "r": diameter * 0.5
        };
    },

    // hide/dispaly 2D and 3D views
    toggleView: function () {
        let e = document.getElementById(this.view2DSelector);
        if (e && e.checked) {
            document.getElementById(this.viewerContainer3D).style.display = "none";
            document.getElementById(this.viewerContainer2D).style.display = "";
            this.render2D();
        }
        e = document.getElementById(this.view3DSelector);
        if (e && e.checked) {
            document.getElementById(this.viewerContainer3D).style.display = "";
            document.getElementById(this.viewerContainer2D).style.display = "none";
            this.render3D();
        }
    },

    // remove objects from 3D scene
    clearScene: function () {
        // find objects to delete
        let objectTypes = [
            "Mesh",
            "LineSegments"
        ];
        let deleteList = [];
        for (let objects in this.scene.children) {
            if (objectTypes.indexOf(this.scene.children[objects].type) > -1) {
                deleteList.push(objects);
            }
        }
        // remove them in reverse order
        for (let i = deleteList.length; i > -1; i--) {
            this.scene.remove(this.scene.children[deleteList[i]]);
        }
    },

    // set up renderer for 3D scene
    renderScene: function () {
        requestAnimationFrame(cds?.fletcher?.renderScene);
        cds?.fletcher?.webGLRenderer?.render(cds?.fletcher?.scene, cds?.fletcher?.camera);
    },

    // convert points array into 3D objects
    render3D: function () {
        this.clearScene();

        // convert points array to 3D points
        let points = [];
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].type === "point") {
                points.push([this.points[i].x, this.points[i].y]);
            } else if (this.points[i].type === "curve") {
                points.push([
                    this.points[i].cpx1,
                    this.points[i].cpy1,
                    this.points[i].cpx2,
                    this.points[i].cpy2,
                    this.points[i].x,
                    this.points[i].y
                ]);
            }
        }

        // get 3D shape based on line thickness
        let outlinePoints = this.get3DOutline(points);

        // add top half
        let upperShape = this.drawShape(outlinePoints.top, points);
        let upperGeometry = new THREE.ExtrudeGeometry(upperShape, this.extrudeProperties);
        let upperMat = new THREE.MeshStandardMaterial({color: cds.fletcher.topColor, roughness: .2, metalness: .4});
        let upperMesh = new THREE.Mesh(upperGeometry, upperMat);
        this.scene.add(upperMesh);

        // add bottom half
        let lowerShape = this.drawShape(points, outlinePoints.bottom);
        let lowerGeometry = new THREE.ExtrudeGeometry(lowerShape, this.extrudeProperties);
        let lowerMat = new THREE.MeshStandardMaterial({color: cds.fletcher.bottomColor, roughness: .2, metalness: .4});
        let lowerMesh = new THREE.Mesh(lowerGeometry, lowerMat);
        this.scene.add(lowerMesh)

        // add outline
        let outlineShape = this.drawShape(outlinePoints.top, outlinePoints.bottom);
        let outlineGeometry = new THREE.ExtrudeGeometry(outlineShape, this.extrudeProperties);
        const edges = new THREE.EdgesGeometry(outlineGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(this.outlineProperties));
        this.scene.add(line);

        // orient object
        let bb = new THREE.Box3();
        bb.setFromObject(line);
        bb.center(this.controls.target);
        let mWidth = bb.max.x - bb.min.x;
        let mHeight = bb.max.y - bb.min.y;
        let mDepth = bb.max.z - bb.min.z;

        // camera.position.set(-mWidth / 2, mHeight * 1.3, -mDepth);
        // this.camera.position.set(mWidth / 2, -mHeight * 1.3, mDepth * 3.25);
        this.camera.position.set(mWidth * 0.75, mHeight * 2, mDepth * 3.25);
        this.controls.update();
    },

    // convert points array and annotations into 2D object
    render2D: function () {
        cds.d2d.figures = []; // reset canvas
        // get coordinate points
        let coords = [];
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].type === "point") {
                coords.push({"x": this.points[i].x, "y": 400 - this.points[i].y});
            } if (this.points[i].type === "curve") {
                // ADD CURVE
                coords.push({"x": this.points[i].x, "y": 400 - this.points[i].y});
            }
        }
        // get annotations
        let annot = [];
        for (let i = 0; i < this.annotAngles.length; i++) {
            annot.push({"type": "angle", "line1": this.annotAngles[i][0], "line2": this.annotAngles[i][1]})
        }
        cds.d2d.drawOpenPath({
            "centered": true,
            "coords": coords,
            "annotations": annot
        });
        cds.d2d.render();
    },

    // create array of points extended above and below the design line, by the half line thickness
    get3DOutline: function (points) {
        let o = {
            "top": [],
            "bottom": []
        }
        for (let i = 0; i < points.length; i++) {
            if (points[i].length === 6) {
                // split curve points into new array to capture all control points of curve
                let pp = [];
                if (i === 0) {
                    pp.push([0, 0]);
                } else {
                    pp.push(points[i-1]);
                }
                pp.push([points[i][0], points[i][1]]);
                pp.push([points[i][2], points[i][3]]);
                pp.push([points[i][4], points[i][5]]);
                if (i < points.length - 1) {
                    pp.push(points[i+1]);
                }
                // iterate over array and assembly points for new curve control points
                let pTop = [];
                let pBottom = [];
                for (let j = 1; j < pp.length - 1; j++) {
                    let ppNew = this.getPointsFromAngle(pp, j, this.lineThickness / 2, "outside");
                    pTop.push(ppNew[0]);
                    pTop.push(ppNew[1]);
                    ppNew = this.getPointsFromAngle(pp, j, -1 * this.lineThickness / 2, "inside");
                    pBottom.push(ppNew[0]);
                    pBottom.push(ppNew[1]);
                }
                o.top.push(pTop);
                o.bottom.push(pBottom);
            } else {
                o.top.push(this.getPointsFromAngle(points, i, this.lineThickness / 2, "outside"));
                o.bottom.push(this.getPointsFromAngle(points, i, -1 * this.lineThickness / 2, "inside"));
            }
            // console.log("top: " + o.top[i]);
            // console.log("bottom: " + o.bottom[i]);
        }
        return o;
    },

    // extend out from vertex at the bisecting angle
    getPointsFromAngle: function (points, i, w, direction) {
        var dx, dy;
        var cp = points[i];
        // var nextP = i === points.length - 1 ? 0 : i + 1;
        // var prevP = i === 0 ? points.length - 1 : i - 1;
        var nextP = i === points.length - 1 ? points.length - 1 : i + 1;
        var prevP = i === 0 ? 0 : i - 1;
        var pp = points[nextP];
        if (pp.length === 6) { pp = [pp[4], pp[5]]; } // for curves get last 2 points in array
        var np = points[prevP];

        // Get the angle between the previous point and the current point.
        dx = pp[0] - cp[0];
        dy = pp[1] - cp[1];
        var f11 = this.getAngle(dx, dy);

        // Get the angle between the current point and the next point.
        dx = np[0] - cp[0];
        dy = np[1] - cp[1];
        var f12 = 2 * Math.PI - this.getAngle(dx, dy);

        // Get the final angle adjusted for any quadrant.
        var f1 = f11 + f12;
        if (f1 > 2 * Math.PI) {
            f1 = f1 - 2 * Math.PI;
        }

        var s1 = w / Math.tan(f1 / 2);
        var c = Math.pow(Math.pow(w, 2) + Math.pow(s1, 2), .5);
        if (direction === "outside") { c *= -1; }
        var p1 = f11 - f1 / 2;
        // overrides for first and last point in array
        if (i === 0) {
            p1 = f11 + Math.PI / 2;
            c = w;
        } else if (i === points.length - 1) {
            p1 = 3 / 2 * Math.PI - f12; // this.getAngle(dx, dy) - Math.PI / 2;
            c = w;
        }
        var newPoint = [];
        newPoint[0] = cp[0] + c * Math.cos(p1);
        newPoint[1] = cp[1] + c * Math.sin(p1);
        return newPoint;
    },

    // get angle between to lines
    getAngle: function (dx, dy) {
        var a1;
        if (dx !== 0) {
            a1 = Math.atan(dy / dx);
            if (dy === 0) {
                if (dx > 0) {
                    a1 = 0;
                } else {
                    a1 = Math.PI;
                }
            } else {
                if (dy > 0 && dx > 0) {
                    // a1 = a1; // Do nothing, and leave the a1 value as is.
                } else if (dy > 0 && dx < 0) {
                    a1 = a1 + Math.PI;
                } else if (dy < 0 && dx < 0) {
                    a1 = a1 + Math.PI;
                } else if (dy < 0 && dx > 0) {
                    a1 = 2 * Math.PI + a1;
                }
            }
        } else {
            if (dy >= 0) {
                a1 = Math.PI / 2;
            } else {
                a1 = 3 * Math.PI / 2;
            }
        }
        return a1;
    },

    // convert top and bottom points arrays into a continuous line segment
    drawShape: function (top, bottom) {
        var shape = new THREE.Shape();

        // draw top half
        for (let i = 0; i < top.length; i++) {
            // console.log(top[i]);
            if (i === 0) {
                shape.moveTo(top[i][0], top[i][1]);
            } else {
                if (top[i].length === 6) {
                    shape.bezierCurveTo(top[i][0], top[i][1], top[i][2], top[i][3], top[i][4], top[i][5]);
                } else {
                    shape.lineTo(top[i][0], top[i][1]);
                }
            }
        }

        // draw bottom half in reverse order
        for (let i = bottom.length - 1; i > -1; i--) {
            // console.log(bottom[i]);
            if (top[i].length === 6) {
                // add enpoint
                shape.lineTo(bottom[i][4], bottom[i][5]);
                // draw curve to previous point in array
                shape.bezierCurveTo(bottom[i][2], bottom[i][3], bottom[i][0], bottom[i][1],
                        bottom[i-1][0], bottom[i-1][1]);
                i--;
            } else {
                shape.lineTo(bottom[i][0], bottom[i][1]);
            }
        }

       return shape;
    }

};
