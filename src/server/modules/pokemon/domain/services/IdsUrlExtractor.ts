export class IdsUrlExtractor {

    public static extractIdFromUrl(url: string): number | null {
        const id = url.split('/')[6]
        return id ? Number(id) : null
    }
}