import { UnitStaticCategories } from '../models/units/unit-static-category';
import { UnitStaticDetails } from '../models/units/unit-static-details';

export type UnitBoxChangeEvent = (
    currentUnit: UnitStaticDetails,
    category: UnitStaticCategories,
    defaultUnit: UnitStaticDetails
) => void;
