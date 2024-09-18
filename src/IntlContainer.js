// @flow
import React from 'react';
import { IntlProvider} from 'react-intl';
import App from './App';
import type { LanguageTag } from './types';
import messages from './messages.json';

function getLangFromLocalStorage(): LanguageTag {
    if (window.localStorage) {
        switch (window.localStorage.getItem('c2lc-lang')) {
            case('en'):
                return 'en';
            case('fr'):
                return 'fr';
            default:
                // Fall through
        }
    }
    return 'en';
}

function setHtmlLang(lang: LanguageTag) {
    const elem = document.documentElement;
    if (elem && elem.tagName === 'HTML') {
        elem.setAttribute('lang', lang);
    }
}

type IntlContainerState = {
    language: LanguageTag
};

export default class IntlContainer extends React.Component<{}, IntlContainerState> {
    constructor(props: any) {
        super(props);

        const language = getLangFromLocalStorage();

        setHtmlLang(language);

        this.state = {
            language: language
        };
    }

    handleChangeLanguage = (language: LanguageTag) => {
        // Remember the language selection in local storage
        if (window.localStorage) {
            window.localStorage.setItem('c2lc-lang', language);
        }

        setHtmlLang(language);

        this.setState({
            language: language
        });
    };

    render() {
        return (
            <IntlProvider
                locale={this.state.language}
                messages={messages[this.state.language]}>
                <App
                    language={this.state.language}
                    onChangeLanguage={this.handleChangeLanguage}
                />
            </IntlProvider>
        );
    }
}
