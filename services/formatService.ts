import Format from "../models/Format";

export interface FormatAttributes { format: string }

class FormatService {

    public async createFormat(attrs: FormatAttributes) {
        try {
            return await Format.create({
                ...attrs
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getAllFormats() {
        return await Format.findAll();
    }

    public async getFormat(format: string) {
        return await Format.findByPk(format);
    }

    public async deleteFormat(format: string) {
        return await Format.destroy({
            where: {format},
        });
    }
}

export default new FormatService();