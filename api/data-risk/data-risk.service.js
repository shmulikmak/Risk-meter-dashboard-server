const { RidkData } = require('./data-risk.model');

const severityStrength = {
    High: 100,
    Medium: 70,
    Low: 40
};

const typeStrength = {
    vip: 100,
    AttackIndication: 80,
    ExploitableData: 60,
    BrandSecurity: 40,
    DataLeakage: 20,
    Phishing: 10
};

/**
 * Get risk data
 *
 * @returns {number}
 */
async function getRiskAverage() {
    const resultsNum = 300;
    let calculateSeverityStrength = 0;
    let calculateTypeStrength = 0;

    const severitySortedData = await RidkData.aggregate([
        { $sort: { date: 1 } }, { $limit: resultsNum },
        { $group: { _id: { severity: '$severity' }, sum: { $sum: 1 } } }
    ]);

    const typeSortedData = await RidkData.aggregate([
        { $sort: { date: 1 } }, { $limit: resultsNum },
        { $group: { _id: { type: '$type' }, sum: { $sum: 1 } } },
    ]);

    calculateSeverityStrength = severitySortedData.reduce((acc, item) => acc += severityStrength[item._id.severity] * item.sum, 0);
    calculateSeverityStrength /= resultsNum;

    calculateTypeStrength = typeSortedData.reduce((acc, item) => acc += typeStrength[item._id.type] * item.sum, 0);
    calculateTypeStrength /= resultsNum;

    // get the average of SeverityStrength & TypeStrength
    const totalStrength = (calculateTypeStrength + calculateSeverityStrength) / 2;

    // get the percentages risk meter
    const totalPercentages = Math.round(totalStrength / resultsNum * 100);

    return totalPercentages;
}

/**
 * Get dashboard data
 *
 * @returns {number}
 */
async function getDashboardData() {
    const [clearWebCount, darkWebCount] = await Promise.all([
        RidkData.count({ networkType: 'ClearWeb' }),
        RidkData.count({ networkType: 'DarkWeb' })
    ]);

    const storedDashboardData = await RidkData.aggregate([
        {
            $facet: {
                clearTypes: [
                    { $match: { networkType: 'ClearWeb' } },
                    { $group: { _id: { type: '$type' }, sum: { $sum: 1 } } }
                ],
                clearSeverities: [
                    { $match: { networkType: 'ClearWeb' } },
                    { $group: { _id: { severity: '$severity' }, sum: { $sum: 1 } } }
                ],
                clearsSources: [
                    { $match: { networkType: 'ClearWeb', sourceType: { $nin: ['HackingForums', 'BlackMarkets'] } } },
                    { $group: { _id: { sourceType: '$sourceType' }, sum: { $sum: 1 } } },
                ],
                darkTypes: [
                    { $match: { networkType: 'DarkWeb' } },
                    { $group: { _id: { type: '$type' }, sum: { $sum: 1 } } }
                ],
                darkSeverities: [
                    { $match: { networkType: 'DarkWeb' } },
                    { $group: { _id: { severity: '$severity' }, sum: { $sum: 1 } } }
                ],
                darkSources: [
                    { $match: { networkType: 'DarkWeb', sourceType: { $nin: ['ApplicationStores', 'SocialMedia'] } } },
                    { $group: { _id: { sourceType: '$sourceType' }, sum: { $sum: 1 } } }
                ],
            }
        }]);

    // Calculate percentage for sourceType
    Object.keys(storedDashboardData[0].clearsSources).forEach(key => {
        storedDashboardData[0].clearsSources[key].sum = parseInt(((100 * storedDashboardData[0].clearsSources[key].sum) / clearWebCount).toFixed(3));
    });

    Object.keys(storedDashboardData[0].darkSources).forEach(key => {
        storedDashboardData[0].darkSources[key].sum = parseInt(((100 * storedDashboardData[0].darkSources[key].sum) / darkWebCount).toFixed(3));
    });

    return storedDashboardData[0];
}

module.exports = {
    getDashboardData,
    getRiskAverage,
    severityStrength,
    typeStrength
};
