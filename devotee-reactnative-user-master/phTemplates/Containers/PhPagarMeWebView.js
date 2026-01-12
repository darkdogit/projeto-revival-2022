import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import environment from '../../environment';

class PhPagarMeWebView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            card: null,
            key: Date.now(),
        };
    }

    styles = StyleSheet.create({
        webview: {
            position: 'absolute',
            height: 0,
            width: 0,
            display: 'none'
        },
    });


    async grabCardHash(values) {
        try {
            const card = JSON.stringify(values)
            const result = await this.getCardHash(card);
            return result
        } catch (error) {
            console.log('error', error);
            return false
        }
    }
    // public method
    getCardHash = card => {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            this.setState({
                card,
                key: Date.now(), // create a unique key for each request
            });

            this.timeout = setTimeout(() => {
                this.onError('timeout');
            }, 30 * 1000);
        });
    };

    onSuccess = cardHash => {
        clearTimeout(this.timeout);
        this.timeout = null;

        if (this.resolve) {
            this.resolve(cardHash);
            this.resolve = null;
        }
    };

    onError = reason => {
        clearTimeout(this.timeout);
        this.timeout = null;

        if (this.reject) {
            this.reject(reason);
            this.reject = null;
        }
    };

    onMessage = async event => {
        const message = JSON.parse(event.nativeEvent.data);
        switch (message.type) {
            case 'success':
                this.onSuccess(message.data);
                break;
            case 'error':
                this.onError(message.error);
                break;
        }
    };

    onWebviewError = e => {
        this.onError(e.nativeEvent.description || 'webviewError');
    };

    render() {
        if (!this.state.card) {
            return null;
        }

        const cardString = JSON.stringify(this.state.card);
        return (
            <WebView
                key={this.state.key}
                originWhitelist={['*']}
                source={{
                    html: `
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <script src="https://assets.pagar.me/pagarme-js/4.5/pagarme.min.js"></script>
            <script>
              function sendMessage(message) {
                window.ReactNativeWebView.postMessage(JSON.stringify(message));
              }
              pagarme.client
                .connect({ encryption_key: '${environment.pagarmeKey}' })
                .then(client => client.security.encrypt(${this.state.card}))
                .then(card_hash => sendMessage({ type: "success", data: card_hash }))
                .catch(error => sendMessage({ type: "error", error: error.response || error.message || 'error' }))
            </script>
        `,
                }}
                style={this.styles.webview}
                onError={this.onWebviewError}
                onHttpError={this.onWebviewError}
                onMessage={this.onMessage}
            />
        );
    }
}

export default PhPagarMeWebView
