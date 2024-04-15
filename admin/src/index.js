// import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginId from "./pluginId";
import CustomDropDownIcon from "./components/CustomDropDownIcon";
import getTrad from "./utils/getTrad";
// import countries from 'i18n-iso-countries';

export default {
  register(app) {
    app.customFields.register({
      name: "custom-dropdown",
      pluginId: "custom-searchable-dropdown",
      type: "string",
      icon: CustomDropDownIcon,
      intlLabel: {
        id: getTrad("custom-searchable-dropdown.label"),
        defaultMessage: "custom-dropdown",
      },
      intlDescription: {
        id: getTrad("custom-searchable-dropdown.description"),
        defaultMessage: "Select any field",
      },
      components: {
        Input: async () => import("./components/CustomDropDown"),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: "form.attribute.item.requiredField",
                  defaultMessage: "Required field",
                },
                description: {
                  id: "form.attribute.item.requiredField.description",
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },

  // async registerTrads({ locales }) {
  //   const importedTrads = await Promise.all(
  //     locales.map((locale) => {
  //       return Promise.all([
  //         import(`./translations/${locale}.json`),
  //         // import(`i18n-iso-countries/langs/${locale}.json`)
  //       ])
  //         .then(([pluginTranslations, countryTranslations]) => {
  //           countries.registerLocale(countryTranslations.default);

  //           return {
  //             data: {
  //               ...prefixPluginTranslations(
  //                 pluginTranslations.default,
  //                 pluginId
  //               ),
  //               [`${pluginId}.countries`]: JSON.stringify(
  //                 countries.getNames(locale)
  //               ),
  //             },
  //             locale,
  //           };
  //         })
  //         .catch(() => {
  //           return {
  //             data: {},
  //             locale,
  //           };
  //         });
  //     })
  //   );
  //   return Promise.resolve(importedTrads);
  // },
};
