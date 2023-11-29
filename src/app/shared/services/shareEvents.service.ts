import { Injectable } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { GlobalMessageConfig, GlobalMessageService, GlobalMessageType } from "@spartacus/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ShareEvents {

    constructor() { }

    private createAccountSubject = new Subject<any>();

    createAccountSubjectSendEvent() {
        this.createAccountSubject.next();
    }
    createAccountSubjectReceiveEvent() {
        return this.createAccountSubject.asObservable();
    }
}