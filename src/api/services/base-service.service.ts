import { DateFilter, SingleRelationFilter } from '../../utils/types';
import dayjs from 'dayjs';

export class BaseService {
    searchOnFields: string[];
    filterFields: string[];
    sortableFields: string[];

    constructor(searchOnFields: string[], filterFileds: string[], sortableFields: string[]) {
        this.searchOnFields = searchOnFields;
        this.filterFields = filterFileds;
        this.sortableFields = sortableFields;
    }

    parseSingleRelationQuery(relationFilter?: SingleRelationFilter) {
        const allowedRelationFilters = ['equals', 'notIn', 'not'];
        const filterResult: SingleRelationFilter = {};
        let validFilter = false;

        if (relationFilter) {
            const relationFilterKeys = Object.keys(relationFilter);

            relationFilterKeys.forEach((key) => {
                if (allowedRelationFilters.includes(key)) {
                    validFilter = true;
                    const value = relationFilter[key as keyof SingleRelationFilter];

                    if (value !== undefined) {
                        filterResult[key as keyof SingleRelationFilter] = value as any;
                    }
                }
            });
        }

        return validFilter ? filterResult : null;
    }

    parseMultipleRelationQuery() {}

    parseSortQuery(option?: string) {
        const [field, value] = option?.split(':') || [];

        const valuesExists = field && value;

        const validField = this.sortableFields.includes(field);

        if (!valuesExists || !validField) {
            return { field: 'id', value: 'desc' };
        }

        return { field, value };
    }

    parseSearchQuery<T>(search?: string): T[] | null {
        if (!search) {
            return null;
        }

        return this.searchOnFields.map((field) => {
            return {
                [field]: {
                    contains: search,
                    mode: 'insensitive', // ← Add this for case-insensitive
                },
            } as T;
        });
    }

    parseDateFilters(dateFilter?: DateFilter) {
        const allowedOperators = ['lte', 'gte', 'equals'];
        const filterResult: DateFilter = {};
        let validFilter = false;

        if (dateFilter) {
            const filterKeys = Object.keys(dateFilter);

            filterKeys.forEach((key) => {
                if (allowedOperators.includes(key)) {
                    validFilter = true;
                    filterResult[key as keyof DateFilter] = dayjs(dateFilter[key as keyof DateFilter]).toISOString();
                }
            });
        }

        return validFilter ? filterResult : null;
    }
}
