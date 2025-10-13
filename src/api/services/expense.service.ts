import Pagination from '../../utils/pagination';

class ExpenseService {
    pagination: Pagination;

    constructor() {
        this.pagination = new Pagination();
    }
}

const expenseService = new ExpenseService();

export default expenseService;
