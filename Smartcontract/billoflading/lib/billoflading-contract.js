/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BillofladingContract extends Contract {
    async instantiate(ctx) {
        console.log('Smart Contract Instantiated');
    }

    async createBillOfLading(ctx, billId, shippersDetail, receiverDetail, thirdPartyCharges, productInfo, carrierDetail, transportationMeans, taxDetail) {
        // Check if the transaction submitter has the 'oilCarrierAtSource' role
        // if (!this.checkRole(ctx, 'oilCarrierAtSource')) {
        //     throw new Error('Only Oil Carrier at Source is allowed to create bills of lading.');
        // }

        // Get the current date and time
        const dateTime = new Date().toISOString();

        // Create a new bill of lading object
        const billOfLading = {
            billId,
            shippersDetail,
            receiverDetail,
            thirdPartyCharges,
            dateTime,
            productInfo,
            carrierDetail,
            transportationMeans,
            taxDetail,
            createdBy: ctx.clientIdentity.getID(), // Record the creator's identity
            status: 'created', // Initial status
            customOptions: '',
            shipmentDetails: '',
        };

        // Save the bill of lading in the ledger
        await ctx.stub.putState(billId, Buffer.from(JSON.stringify(billOfLading)));

        // Return the created bill of lading
        return JSON.stringify(billOfLading);
    }

    async updateCustomOptions(ctx, billId, customOptions) {
        // Check if the transaction submitter has the 'customs' role
        // if (!this.checkRole(ctx, 'customs')) {
        //     throw new Error('Only Customs is allowed to update custom options.');
        // }

        // Retrieve the existing bill of lading
        const existingBill = await this.getBillOfLading(ctx, billId);

        // Check if the bill is in a state where customs can update
        if (existingBill.status !== 'created' && existingBill.status !== 'verified') {
            throw new Error('Customs can only update custom options for bills in the "created" or "verified" state.');
        }

        // Update custom options
        existingBill.customOptions = customOptions;

        // Save the updated bill of lading in the ledger
        await ctx.stub.putState(billId, Buffer.from(JSON.stringify(existingBill)));

        // Return the updated bill of lading
        return JSON.stringify(existingBill);
    }

    async updateShipmentDetails(ctx, billId, shipmentDetails) {
        // Check if the transaction submitter has the 'shippingCompany' role
        if (!this.checkRole(ctx, 'shippingCompany')) {
            throw new Error('Only Shipping Companies are allowed to update shipment details.');
        }

        // Retrieve the existing bill of lading
        const existingBill = await this.getBillOfLading(ctx, billId);

        // Check if the bill is in a state where shipping companies can update
        if (existingBill.status !== 'verified' && existingBill.status !== 'delivered') {
            throw new Error('Shipping companies can only update shipment details for bills in the "verified" or "delivered" state.');
        }

        // Update shipment details
        existingBill.shipmentDetails = shipmentDetails;

        // Save the updated bill of lading in the ledger
        await ctx.stub.putState(billId, Buffer.from(JSON.stringify(existingBill)));

        // Return the updated bill of lading
        return JSON.stringify(existingBill);
    }

    async verifyBillByOilRefinery(ctx, billId) {
        // Check if the transaction submitter has the 'oilRefinery' role
        // if (!this.checkRole(ctx, 'oilRefinery')) {
        //     throw new Error('Only Oil Refinery is allowed to verify bills of lading.');
        // }

        // Retrieve the existing bill of lading
        const existingBill = await this.getBillOfLading(ctx, billId);

        // Check if the bill is already verified
        if (existingBill.status !== 'created') {
            throw new Error('The bill of lading has already been verified.');
        }

        // Update the status to 'verified'
        existingBill.status = 'verified';

        // Save the updated bill of lading in the ledger
        await ctx.stub.putState(billId, Buffer.from(JSON.stringify(existingBill)));

        // Return the updated bill of lading
        return JSON.stringify(existingBill);
    }

    async deliverShipmentByDistributionTerminal(ctx, billId) {
        // Check if the transaction submitter has the 'oilDistributionTerminal' role
        // if (!this.checkRole(ctx, 'oilDistributionTerminal')) {
        //     throw new Error('Only Oil Distribution Terminal is allowed to deliver shipments.');
        // }

        // Retrieve the existing bill of lading
        const existingBill = await this.getBillOfLading(ctx, billId);

        // Check if the bill is verified
        if (existingBill.status !== 'verified') {
            throw new Error('The bill of lading needs to be verified before delivery.');
        }

        // Update the status to 'delivered'
        existingBill.status = 'delivered';

        // Save the updated bill of lading in the ledger
        await ctx.stub.putState(billId, Buffer.from(JSON.stringify(existingBill)));

        // Return the updated bill of lading
        return JSON.stringify(existingBill);
    }

    async getBillOfLading(ctx, billId) {
        const existingBillBytes = await ctx.stub.getState(billId);
        return existingBillBytes && existingBillBytes.length > 0 ? JSON.parse(existingBillBytes.toString()) : null;
    }

    checkRole(ctx, requiredRole) {
        const clientIdentity = ctx.clientIdentity;
        const roles = clientIdentity.getAttributeValue('roles');
        return roles && roles.includes(requiredRole);
    }
}


module.exports = BillofladingContract;
