import Format from "../models/Format";

export interface FormatAttributes { format: string }

class FormatService {

    public async createFormat(attrs: FormatAttributes) {
        try {
            const newFormat = await Format.create({
                ...attrs
            });
            return newFormat;
        } catch (error: any) {
            throw error;
        }
    }

    public async getAllFormats() {
        return await Format.findAll();
    }

    public async getFormat(format: string) {
        const result = await Format.findByPk(format);
        return result;
    }

    public async deleteFormat(format: string) {
        const deleted = await Format.destroy({
            where: { format },
        });
        return deleted;
    }
}

export default new FormatService();