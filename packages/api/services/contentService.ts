import Content from '../models/Content';

interface ContentAttributes {
    pairing_id: string;
    url: string;
}

interface GetContentParams {
    url?: string;
    pairing_id?: string;
}

class ContentService {
    public async createContent(attrs: ContentAttributes) {
        try {
            return await Content.create({
                ...attrs,
            });
        } catch (error: any) {
            throw error;
        }
    }

    async getContent(params: GetContentParams) {
        const { url, pairing_id } = params;
        const whereClause: any = {};
        if (pairing_id) whereClause.pairing_id = pairing_id;
        if (url) whereClause.url = url;
        return await Content.findAll({
            where: {
                ...whereClause,
            }
        });
    }

    public async deleteContent(url: string) {
        return await Content.destroy({
            where: { url },
        });
    }
}

export default new ContentService();
