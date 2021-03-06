import Server from '@js/Models/Server/Server';
import ServerRepository from '@js/Repositories/ServerRepository';
import Api from 'passwords-client';
import SystemService from '@js/Services/SystemService';
import LocalisationService from '@js/Services/LocalisationService';
import EnhancedPassword from 'passwords-client/src/Model/Password/EnhancedPassword';
import EnhancedFolder from 'passwords-client/src/Model/Folder/EnhancedFolder';
import EnhancedTag from 'passwords-client/src/Model/Tag/EnhancedTag';

class ApiRepository {

    constructor() {
        this._api = {};
    }

    /**
     *
     * @returns {Promise<Api[]>}
     */
    async findAll() {
        let apis  = await this._loadApis(),
            array = [];

        for(let id in apis) {
            if(apis.hasOwnProperty(id)) {
                array.push(apis[id]);
            }
        }

        return array;
    }

    /**
     *
     * @returns {Promise<Api>}
     */
    async findById(id) {
        let apis = await this._loadApis();

        if(apis.hasOwnProperty(id)) {
            return apis[id];
        }

        // @TODO: Use custom NotFoundError here
        throw new Error('Api not found');
    }

    /**
     *
     * @param {Api} api
     */
    async delete(api) {
        let apis = await this._loadApis();

        if(apis.hasOwnProperty(api.getServer().getId())) {
            delete apis[api.getServer().getId()];
        }
    }

    /**
     *
     * @return {Promise<{Api}>}
     * @private
     */
    async _loadApis() {
        let servers = await ServerRepository.findAll(),
            classes = {model: {server: Server, password: EnhancedPassword, folder: EnhancedFolder, tag: EnhancedTag}},
            config  = await this._getApiConfig();

        for(let server of servers) {
            if(!this._api.hasOwnProperty(server.getId())) {
                this._api[server.getId()] = new Api(server, config, classes);
            }
        }

        return this._api;
    }

    /**
     *
     * @return {Promise<{userAgent: string}>}
     * @private
     */
    async _getApiConfig() {
        let bwInfo = await SystemService.getBrowserInfo(),
            osInfo = await SystemService.getBrowserApi().runtime.getPlatformInfo(),
            os     = osInfo.os ? `${osInfo.os[0].toUpperCase()}${osInfo.os.substr(1)}`:'';

        return {
            userAgent: LocalisationService.translate('UserAgent', [bwInfo.name, os])
        };
    }
}

export default new ApiRepository();