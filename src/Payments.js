import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
    MFPaymentRequest,
    MFCustomerAddress,
    MFExecutePaymentRequest,
    MFCardInfo,
    Response,
    MFSendPaymentRequest,
    MFLanguage,
    MFNotificationOption,
    MFPaymentype,
    MFMobileCountryCodeISO,
    MFCurrencyISO,
    MFPaymentStatusRequest,
    MFKeyType,
    MFInitiatePayment
} from 'myfatoorah-reactnative';
import { CreditCardInput } from "react-native-credit-card-input";
import { rendererror } from './config';
import styles, { hp } from './component/Assets/style/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Main_Button } from './component/Assets/common/Main_Button';


class Payments extends Component {
    constructor(props) {
        const data = props.route.params
        // console.log(data);
        super(props)
        this.state = {
            loading: false,
            recurringId: '',
            paymentMethods: data.paymentMethods,
            selectedIndex: data.selectedIndex,
            invoiceValue: data.invoiceValue,
            id: data?.data?.userId,
            cardNumber: '',
            cvv: '',
            expiry: '',
            isDirectPayment: data.paymentMethods[data.selectedIndex].IsDirectPayment,
            disabledPay: true,
            email: data.data.email
        }
    }
    componentDidMount() {
        const { selectedIndex, paymentMethods } = this.state
        if (paymentMethods[selectedIndex].IsDirectPayment == false) {
            this.setState({ disabledPay: false })
            this.executePayment();
        }

    }



    onExecuteDirectPaymentButtonClickHandler = () => {
        this.executeDirectPayment();
    };


    render() {
        const { isDirectPayment, selectedIndex, disabledPay } = this.state
        const { navigation } = this.props
        return (
            <View style={{ ...styles.styleFirst }}>
                <View style={{ ...styles.view92, marginTop: hp(2) }}>
                    {isDirectPayment &&
                        <CreditCardInput
                            onChange={this._onChange}
                            inputStyle={{ color: '#ddd' }}
                            labelStyle={{ color: '#181414' }}
                            placeholderColor={'#a2a2a2'}
                        />
                    }
                    <Main_Button
                        onPress={() => this.onExecuteDirectPaymentButtonClickHandler()}
                        marginT={hp(2)}
                        text={"confirm Pay"} />
                </View>
            </View>
        );
    }

    async onSuccess(payment) {
        const apiToken = await AsyncStorage.getItem('UserId')
        const data = this.props.route.params.data

        this.props.navigation.navigate("Home", apiToken, { ...data, payment })
        console.log("payment", payment, data);
    }

    getCardInfo() {
        const { cvv, cardNumber, expiry, email } = this.state
        const { userRegister, user } = this.props
        let cardExpiryMonth = expiry.split("/")[0]
        let cardExpiryYear = expiry.split("/")[1]
        let cardSecureCode = cvv
        let paymentType = MFPaymentype.CARD
        let cardHolderName = email
        // let paymentType = MFPaymentype.TOKEN
        let saveToken = false
        let card = new MFCardInfo(cardNumber.replace(/ /g, ''), cardExpiryMonth, cardExpiryYear, cardSecureCode, cardHolderName, paymentType, saveToken)
        card.bypass = true

        return card
    }
    executeResquestJson() {
        const { userRegister, email } = this.props
        const { invoiceValue, selectedIndex, paymentMethods } = this.state
        let request = new MFExecutePaymentRequest(parseFloat(invoiceValue), paymentMethods[selectedIndex].PaymentMethodId);
        request.customerEmail = email // must be email
        request.customerMobile = '0512345678';
        request.customerCivilId = "";
        let address = new MFCustomerAddress("ddd", "sss", "sss", "sss", "sss");
        request.customerAddress = address;
        request.customerReference = "";
        request.language = "en";
        request.mobileCountryCode = MFMobileCountryCodeISO.SAUDIARABIA;
        request.displayCurrencyIso = MFCurrencyISO.SAUDIARABIA_SAR;

        return request;
    }

    executePayment() {
        let request = this.executeResquestJson();
        // console.log("77", request);
        MFPaymentRequest.sharedInstance.executePayment(this.props.navigation, request, MFLanguage.ENGLISH, (response: Response) => {
            if (response.getError()) {
                rendererror(response.getError().error)
            } else {
                var bodyString = response.getBodyString();
                var invoiceId = response.getInvoiceId();
                var paymentStatusResponse = response.getBodyJson().Data;
                this.onSuccess(paymentStatusResponse)
                // console.log('aa', paymentStatusResponse);
            }
        });
    }

    getPaymentStatus() {
        var paymentStatusRequest = new MFPaymentStatusRequest('111111', MFKeyType.PAYMENTID);
        MFPaymentRequest.sharedInstance.getPaymentStatus(paymentStatusRequest, MFLanguage.ENGLISH, (response: Response) => {
            this.hideLoading()
            if (response.getError()) {
                rendererror(response.getError().error)
            }
            else {
                rendererror(response.getBodyString())
                // console.log('zz', response);
            }
        });
    }
}


export default Payments;

