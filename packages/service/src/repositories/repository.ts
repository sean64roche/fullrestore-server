import {Logger} from "../utils/logger.js";
import {ApiConfig} from "../config.js";
import axios from "axios";

abstract class Repository {
    protected readonly config: ApiConfig;
    protected readonly logger: Logger;
    protected constructor(config: ApiConfig) {
        this.config = config;
        this.logger = config.logger;
        axios.defaults.headers.common['Authorization'] = `Bearer ${config.token}`;
    }
}

export default Repository;