//
export class QueryParametersHelper {
    static getParameter(name: string): string | null {
        const qs = window.location.search;
        const qp = new URLSearchParams(qs);
        return qp.get(name);
    }
}
