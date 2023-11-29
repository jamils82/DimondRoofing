/*
 * CDS Visual 2D drawing library
 *
 * Copyright (c) CDS Visual. All Rights Reserved.
 */
var cds = cds || {};

cds.d2d = {
    defaults: {
        dimensionUnit: "meters",
        dimensionWidth: 100.0,
        showGrid: true,
        showBackgroundImage: false,
        backgroundImageAlpha: 0.5,
        gridSmallGap: 6,
        gridSmallLineWidth: 1,
        gridSmallColor: "#f7f7f7",
        gridLargeGap: 24,
        gridLargeLineWidth: 1,
        gridLargeColor: "#e8e6e6",
        drawingLineWidth: 1,
        drawingLineCap: "butt",
        annotationFont: "12px sans-serif",
        annotationColor: "#999",
        angleAnnotationOffset: 15.0,
        drawingColor: "#00f",
        defaultLineWidth: 1,
        defaultColor: "#000"
    },

    canvas: null,
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    mousex: 0,
    mousey: 0,
    startMousex: 0,
    startMousey: 0,
    mousedown: false,
    mode: "measure",
    figures: [],
    showTempFigure: false,

    setDefaults: function (defaults) {
        if (defaults) {
            for (let i in defaults) {
                if (this.defaults.hasOwnProperty(i)) {
                    this.defaults[i] = defaults[i];
                }
            }
            this.setDimensions();
        }
    },

    setDimensions: function () {
        if (this.canvasWidth === 0 || this.defaults.dimensionWidth === 0) {
            this.px2dims = 1.0;
            return;
        }
        this.px2dims = this.canvasWidth / this.defaults.dimensionWidth;
    },

    init: function (defaults) {
        // window.devicePixelRatio = 2;
        if (defaults) {
            this.setDefaults(defaults);
        }
        this.canvas = document.getElementById("cds-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.getBoundingClientRect().width;
        this.canvasHeight = this.canvas.getBoundingClientRect().height;
        this.setDimensions();

        this.render();
    },

    drawOpenPath: function (args) {
        if (!args) {
            args = {};
        }

        let figure = {
            type: "openPath",
            color: args["color"] || this.defaults.drawingColor,
            lineWidth: args["lineWidth"] || this.defaults.defaultLineWidth,
            lineCap: args["lineCap"] || this.defaults.defaultLineCap,
            coords: args["coords"] || [],
            centered: args["centered"] === true,
            annotations: args["annotations"] || null
        }
        if (figure.coords !== null) {
            this.figures.push(figure);
        }
    },

    _getCenteredDrawingOffset: function (path) {
        if (!path || !path.length) {
            return {"x": 0, "y": 0};
        }

        let minx = path.reduce(function (a, b) { return a.x < b.x ? a : b; }).x * this.px2dims;
        let miny = path.reduce(function (a, b) { return a.y < b.y ? a : b; }).y * this.px2dims;
        let maxx = path.reduce(function (a, b) { return a.x > b.x ? a : b; }).x * this.px2dims;
        let maxy = path.reduce(function (a, b) { return a.y > b.y ? a : b; }).y * this.px2dims;

        let x = -1 * (minx - (this.canvasWidth - (maxx - minx)) / 2.0);
        let y = -1 * (miny - (this.canvasHeight - (maxy - miny)) / 2.0);
        let o = {"x": x, "y": y};
        return o;
    },

    getpxl: function (pos, offset) {
        if (offset) {
            return pos * this.px2dims + 0.5 + offset;
        } else {
            return pos * this.px2dims + 0.5;
        }
    },

    render: function () {
        this.clearCanvas();
        this.renderGrid();
        this.renderFigures();
    },

    clearCanvas: function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    renderGrid: function () {
        if (!this.defaults.showGrid) {
            return;
        }

        // draw small grid
        let gap = this.defaults.gridSmallGap;
        if (gap > 0) {
            this.ctx.beginPath();
            for (let x = gap; x < this.canvasWidth; x += gap) {
                this.ctx.moveTo(0.5 + x, 0);
                this.ctx.lineTo(0.5 + x, this.canvasHeight);
            }
            for (let y = gap; y < this.canvasHeight; y += gap) {
                this.ctx.moveTo(0, 0.5 + y);
                this.ctx.lineTo(this.canvasWidth, 0.5 + y);
            }
            this.ctx.strokeStyle = this.defaults.gridSmallColor;
            this.ctx.lineWidth = this.defaults.gridSmallLineWidth;
            this.ctx.stroke();
        }

        // draw large grid
        gap = this.defaults.gridLargeGap;
        if (gap > 0) {
            this.ctx.beginPath();
            for (let x = gap; x < this.canvasWidth; x += gap) {
                this.ctx.moveTo(0.5 + x, 0);
                this.ctx.lineTo(0.5 + x, this.canvasHeight);
            }
            for (let y = gap; y < this.canvasHeight; y += gap) {
                this.ctx.moveTo(0, 0.5 + y);
                this.ctx.lineTo(this.canvasWidth, 0.5 + y);
            }
            this.ctx.strokeStyle = this.defaults.gridLargeColor;
            this.ctx.lineWidth = this.defaults.gridLargeLineWidth;
            this.ctx.stroke();
        }
    },

    renderAngleAnnotation: function (line1, line2, offset) {
        let degree = this.getAngleBetween2Lines(line1, line2);
        let angleOffset = this.defaults.angleAnnotationOffset;
        let pos = this.getPointsFromAngle({"x": line1.x1, "y": line1.y1},
                this.getLineIntersection(line1, line2), {"x": line2.x2, "y": line2.y2},
                angleOffset);

        this.ctx.font = this.defaults.annotationFont;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = this.defaults.annotationColor;
        this.ctx.fillText(degree.toFixed(0) + "Â°", this.getpxl(pos.x, offset.x),
                this.getpxl(pos.y, offset.y));
    },

    renderFigures: function () {
        if (this.figures && this.figures.length) {
            for (let i = 0; i < this.figures.length; i++) {
                switch (this.figures[i].type) {
                    case "openPath":
                        let figure = this.figures[i];
                        let coords = figure.coords;
                        let offset = {"x": 0, "y": 0};
                        if (figure.centered) {
                            offset = this._getCenteredDrawingOffset(figure.coords);
                        }
                        if (figure.coords && figure.coords.length) {
                            this.ctx.beginPath();
                            this.ctx.strokeStyle = this.defaults.drawingColor;
                            this.ctx.lineWidth = this.defaults.drawingLineWidth;
                            this.ctx.lineCap = this.defaults.drawingLineCap;
                            this.ctx.moveTo(this.getpxl(coords[0].x, offset.x),
                                    this.getpxl(coords[0].y, offset.y));
                            for (let i = 1; i < coords.length; i++) {
                                this.ctx.lineTo(this.getpxl(coords[i].x, offset.x),
                                        this.getpxl(coords[i].y, offset.y));
                            }
                            this.ctx.stroke();
                        }
                        if (figure.annotations && figure.annotations.length) {
                            for (let i = 0; i < figure.annotations.length; i++) {
                                let annotation = figure.annotations[i];
                                if (annotation.type === "angle") {
                                    let p1 = figure.coords[annotation.line1];
                                    let p2 = figure.coords[annotation.line1 + 1];
                                    let p3 = figure.coords[annotation.line2];
                                    let p4 = figure.coords[annotation.line2 + 1];
                                    this.renderAngleAnnotation(
                                        {"x1": p1.x, "y1": p1.y, "x2": p2.x, "y2": p2.y},
                                        {"x1": p3.x, "y1": p3.y, "x2": p4.x, "y2": p4.y}, offset
                                    );
                                }
                            }
                        }
                        break;
                }
            }
        }
    },

    // returns null if lines are parallel whether or not they overlap
    getLineIntersection: function (line1, line2) {
        let a1 = line1.y2 - line1.y1;
        let b1 = line1.x1 - line1.x2;
        let c1 = a1 * line1.x1 + b1 * line1.y1;
        let a2 = line2.y2 - line2.y1;
        let b2 = line2.x1 - line2.x2;
        let c2 = a2 * line2.x1 + b2 * line2.y1;
        let determinant = a1 * b2 - a2 * b1;
        if (determinant === 0) {
            return null;
        } else {
            let x = (b2 * c1 - b1 * c2) / determinant;
            let y = (a1 * c2 - a2 * c1) / determinant;
            return {"x": x, "y": y};
        }
    },

    getAngleBetween2Lines: function (line1, line2) {
        let inter = this.getLineIntersection(line1, line2);
        let ab = Math.sqrt(Math.pow(inter.x - line1.x1, 2) + Math.pow(inter.y - line1.y1, 2));
        let bc = Math.sqrt(Math.pow(inter.x - line2.x2, 2) + Math.pow(inter.y - line2.y2, 2));
        let ac = Math.sqrt(Math.pow(line2.x2 - line1.x1, 2)+ Math.pow(line2.y2 - line1.y1, 2));
        return Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180 / Math.PI;
    },

    getPointsFromAngle: function (p1, p2, p3, offset) {
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        let f11 = this.angle(dx, dy);
        dx = p3.x - p2.x;
        dy = p3.y - p2.y;
        let f12 = 2 * Math.PI - this.angle(dx, dy);

        let f1 = f11 + f12;
        if (f1 > 2 * Math.PI) {
            f1 = f1 - 2 * Math.PI;
        }

        let s1 = offset / Math.tan(f1 / 2);
        let c = Math.pow(Math.pow(offset, 2) + Math.pow(s1, 2), 0.5);
        let p = f11 - f1 / 2;
        return {"x": p2.x + c * Math.cos(p), "y": p2.y + c * Math.sin(p)}
    },

    angle: function (dx, dy) {
        let a1;
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
    }
};
