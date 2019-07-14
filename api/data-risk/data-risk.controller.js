const express = require('express');
const { getRiskAverage, getDashboardData } = require('./data-risk.service');
const logger = require('../../lib/logger');

/**
 * Get risk data
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getRiskMeterData(req, res) {
    try {
        const riskData = await getRiskAverage();

        res.json(riskData);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred while try to get risk meter', statusCode: 500 });
        logger.error('Error in getRiskMeterData api', error);
    }
}

/**
 * Get dashboard data
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getAllStatisticsDashboardData(req, res) {
    try {
        const StatisticsdashboardData = await getDashboardData();

        res.json(StatisticsdashboardData);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred while try to get risk meter', statusCode: 500 });
        logger.error('Error in getAllStatisticsDashboardData api', error);
    }
}

module.exports = {
    getRiskMeterData,
    getAllStatisticsDashboardData
};
