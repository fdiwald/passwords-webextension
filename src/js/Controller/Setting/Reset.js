import AbstractController from '@js/Controller/AbstractController';
import SettingsService from '@js/Services/SettingsService';

export default class Reset extends AbstractController {

    constructor() {
        super();
        this._resettableSettings = [
            'password.autosubmit',
            'popup.autoclose',
            'popup.related.search',
            'notification.password.new',
            'notification.password.update',
            'server.default',
            'theme.current',
            'theme.custom'
        ];
    }

    /**
     *
     * @param {Message} message
     * @param {Message} reply
     * @return {Promise<void>}
     */
    async execute(message, reply) {
        let setting = message.getPayload();

        try {
            if(this._resettableSettings.indexOf(setting) !== -1) {
                let value = await SettingsService.reset(setting);
                reply.setType('setting.value').setPayload(value);
            } else {
                reply.setPayload(
                    {
                        success: false,
                        message: 'Unknown setting'
                    }
                );
            }
        } catch(e) {
            reply.setPayload(
                {
                    success: false,
                    message: e.message
                }
            );
        }
    }
}