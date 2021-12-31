const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const NativeTextAreaContextMenu = getModule(m => m?.default?.displayName === 'NativeTextAreaContextMenu', false);
const SlateTextAreaContextMenu = getModule(m => m?.default?.displayName === 'SlateTextAreaContextMenu', false);
const { expressionSuggestionsEnabled } = getModule(['expressionSuggestionsEnabled'], false);
const Expressions = getModule(['toggleExpressionSuggestionsEnabled'], false);
const Stickers = getModule(['queryStickers'], false);

module.exports = class HideDMButtons extends Plugin {
   startPlugin() {
      inject('dss-slate-text-area', SlateTextAreaContextMenu, 'default', (args, res) => {
         res.props.children.splice(0, 1);

         return res;
      });

      inject('dss-native-text-area', NativeTextAreaContextMenu, 'default', (args, res) => {
         res.props.children.splice(0, 1);

         return res;
      });

      inject('dss-query-stickers', Stickers, 'queryStickers', ([, , channel], res) => {
         if (channel) {
            return { stickers: [] };
         }

         return res;
      });

      Expressions._toggleExpressionSuggestionsEnabled = Expressions.toggleExpressionSuggestionsEnabled;
      Expressions.toggleExpressionSuggestionsEnabled = () => void 0;

      if (expressionSuggestionsEnabled) Expressions._toggleExpressionSuggestionsEnabled();
   }

   pluginWillUnload() {
      Expressions.toggleExpressionSuggestionsEnabled = Expressions._toggleExpressionSuggestionsEnabled;
      uninject('dss-slate-text-area');
      uninject('dss-native-text-area');
      uninject('dss-query-stickers');
   }
};