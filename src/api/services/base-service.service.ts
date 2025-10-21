import { Prisma } from '../../../generated/prisma';
import { DateFilter, SingleRelationFilterQuery } from '../../utils/types';
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

    parseMultipleRelationQuery(key: string, relationFilter?: string[]) {
        const resultArray: number[] = [];

        if (!relationFilter || relationFilter.length <= 0) {
            return null;
        }

        for (let i = 0; i < relationFilter.length; i++) {
            const listValue = parseInt(relationFilter[i]);

            if (Number.isNaN(listValue)) {
                return null;
            }

            resultArray.push(listValue);
        }

        return resultArray.map((value) => ({
            [key]: { some: { id: value } },
        }));
    }

    parseSingleRelationQuery<T>(relationFilter?: SingleRelationFilterQuery) {
        const allowedRelationFilters = ['equals', 'not'];
        const filterResult: Prisma.IntNullableFilter<T> = {};
        let validFilter = false;

        if (relationFilter) {
            const relationFilterKeys = Object.keys(relationFilter);

            relationFilterKeys.forEach((key) => {
                if (allowedRelationFilters.includes(key)) {
                    validFilter = true;
                    const paramValue: string = relationFilter[key as keyof SingleRelationFilterQuery] as string;
                    let finalValue: null | number | undefined;

                    if (paramValue === 'null') {
                        finalValue = null;
                    } else if (!Number.isNaN(parseInt(paramValue))) {
                        finalValue = parseInt(paramValue);
                    } else {
                        finalValue = undefined;
                    }

                    filterResult[key as keyof SingleRelationFilterQuery] = finalValue;
                }
            });
        }

        return validFilter ? filterResult : null;
    }

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
