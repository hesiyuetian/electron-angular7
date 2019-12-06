import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {

    /*-----Data Part-----*/

    @Input() currentPage: number = 1;
    @Input() pageSize: number = 10;
    @Input() totalRow: number = 1000;
    @Output() onCurrentPageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    totalPage: number;
    pageRange: number = 5;
    middlePages: Array<number>;
    changePageSize: number = this.pageSize;
    changePageSizeDebounce: any;
    changeCurrentPage: number;

    /*-----Constructor Part-----*/

    constructor(
      public translate: TranslateService,
    ) {

    }

    /*-----Lifecycle Park-----*/

    //Mounted
    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }



    //init
    init() {
        this.setTotalPage();
        this.setMiddlePage();
    }

    setTotalPage() {
        this.totalPage = Math.ceil(this.totalRow / this.pageSize);
    }

    setMiddlePage() {
        this.middlePages = [];
        for (let i = this.currentPage - this.pageRange < 1 ? 1 : this.currentPage - this.pageRange; i <= this.currentPage + this.pageRange && i <= this.totalPage; i++) {
            this.middlePages.push(i);
        }
    }

    jumpToChangeCurrentPage() {
        if (this.changeCurrentPage && this.changeCurrentPage > 0 && this.changeCurrentPage <= this.totalPage) {
            this.currentPage = this.changeCurrentPage;
            // this.setMiddlePage();
            this.onCurrentPageChange.emit(this.currentPage);
        }
    }

    /**
     * 输入限制 onkeydown
     * @param event
     */
    onInputKeyDown(event) {
        let inputKey = (event && event.key) || '0';
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].indexOf(inputKey) === -1) {
            event.preventDefault();
            return;
        }
    }

    setCurrentPage(i) {
        if (i > 0 && i <= this.totalPage) {
            this.currentPage = i;
            this.onCurrentPageChange.emit(this.currentPage);
            this.setMiddlePage();

        }
    }

    setPageSize() {
        //因为修改了每页显示行数，所以需跳转到第一页
        this.changeCurrentPage = 1;
        this.setCurrentPage(1);
        clearTimeout(this.changePageSizeDebounce);
        this.changePageSizeDebounce = setTimeout(() => {
            this.onPageSizeChange.emit(this.changePageSize || 10);
        }, 500)
    }

}

