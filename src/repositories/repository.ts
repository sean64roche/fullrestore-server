import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";
import axios from "axios";

abstract class Repository {
    protected readonly config: ApiConfig;
    protected readonly logger: Logger;
    protected constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
        axios.defaults.headers.common['Authorization'] = `Bearer ${config.token}`;
    }
}

export default Repository;