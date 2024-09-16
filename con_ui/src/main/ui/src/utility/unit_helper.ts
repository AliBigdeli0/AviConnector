import { UnitStaticCategories } from '../models/units/unit-static-category';
import { UnitStaticDetails } from '../models/units/unit-static-details';
import { UnitNotFoundType } from '../types/units';

export class UnitHelper {
    static getCategory(
        categoryId: number,
        categories: UnitStaticCategories[] | undefined
    ): UnitStaticCategories | UnitNotFoundType {
        if (categories === undefined) return 'Not Found';
        return (
            categories.filter((category) => category.id === categoryId)[0] ??
            'Not Found'
        );
    }

    static getUnit(
        categoryId: number,
        unitId: number,
        categories: UnitStaticCategories[] | undefined
    ): UnitStaticDetails | UnitNotFoundType {
        if (categories === undefined) return 'Not Found';

        const category = this.getCategory(categoryId, categories);
        if (category === 'Not Found') return 'Not Found';
        return (
            category.details.filter((unit) => unit.id === unitId)[0] ??
            'Not Found'
        );
    }

    static getCategoryName(
        categoryId: number,
        categories: UnitStaticCategories[] | undefined
    ): string {
        const category = this.getCategory(categoryId, categories);
        if (category === 'Not Found') return 'Not Found';
        return category.name;
    }

    static getUnitName(
        categoryId: number,
        unitId: number,
        categories: UnitStaticCategories[] | undefined
    ): string {
        const unit = this.getUnit(categoryId, unitId, categories);
        if (unit === 'Not Found') return 'Not Found';
        return unit.name;
    }
}
