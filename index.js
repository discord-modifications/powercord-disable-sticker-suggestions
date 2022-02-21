const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const Expressions = getModule(['useStickerSuggestionResults'], false);
const Stickers = getModule(['queryStickers'], false);

module.exports = class HideDMButtons extends Plugin {
   startPlugin() {
      inject('dss-query-stickers', Stickers, 'queryStickers', ([, , channel], res) => {
         if (channel) {
            return { stickers: [] };
         }

         return res;
      });

      inject('dss-sticker-results', Expressions, 'useStickerSuggestionResults', (args, res) => {
         return [];
      });
   }

   pluginWillUnload() {
      uninject('dss-sticker-results');
      uninject('dss-query-stickers');
   }
};