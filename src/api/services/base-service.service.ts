export class BaseService {
    searchOnFields: string[];
    filterFields: string[];
    sortableFields: string[];

    constructor(searchOnFields: string[], filterFileds: string[], sortableFields: string[]) {
        this.searchOnFields = searchOnFields;
        this.filterFields = filterFileds;
        this.sortableFields = sortableFields;
    }

    parseFindOpts(option?: string) {
        const [field, value] = option?.split(':') || [];

        const valuesExists = field && value;

        const validField =
            this.searchOnFields.includes(field) ||
            this.filterFields.includes(field) ||
            this.sortableFields.includes(field);

        if (!valuesExists || !validField) {
            return null;
        }

        return { field, value };
    }
}
