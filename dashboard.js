// Create dashboard.js file in the root directory
const config = {
    repoOwner: 'roopxx',
    repoName: 'pr-agent-test',
    botUsername: 'coderabbitai[bot]',
    costPerUser: 10 // $10 per user per month
};

// Mock data for initial display
const mockData = {
    totalReviews: 237,
    monthlyReviews: 42,
    previousMonthReviews: 38,
    uniqueAuthors: 16,
    avgReviewTime: 4.2,
    reviewsByMonth: [18, 25, 30, 32, 35, 38, 42],
    outcomes: {
        approved: 154,
        needsChanges: 68,
        needsReview: 15
    },
    recentReviews: [
        { pr: '#123', title: 'Add new feature', author: 'developer1', bot: config.botUsername, date: '2025-04-20', outcome: 'approved' },
        { pr: '#122', title: 'Fix critical bug', author: 'developer2', bot: config.botUsername, date: '2025-04-19', outcome: 'approved' },
        { pr: '#121', title: 'Update documentation', author: 'developer3', bot: config.botUsername, date: '2025-04-18', outcome: 'needs-changes' },
        { pr: '#120', title: 'Refactor auth module', author: 'developer4', bot: config.botUsername, date: '2025-04-17', outcome: 'needs-changes' },
        { pr: '#119', title: 'Add unit tests', author: 'developer1', bot: config.botUsername, date: '2025-04-16', outcome: 'approved' }
    ]
};

// Initialize dashboard
function initDashboard() {
    updateMetrics();
    populateRecentReviews();
    createCharts();

    // Set up automatic refresh every 5 minutes
    setInterval(fetchRealData, 5 * 60 * 1000);
}

// Update dashboard metrics with data
function updateMetrics(data = mockData) {
    document.getElementById('total-reviews').textContent = data.totalReviews;
    document.getElementById('monthly-reviews').textContent = data.monthlyReviews;
    
    const monthlyChange = data.monthlyReviews - data.previousMonthReviews;
    const monthlyTrendEl = document.getElementById('monthly-trend');
    if (monthlyChange > 0) {
        monthlyTrendEl.innerHTML = `<i class="bi bi-arrow-up"></i> +${monthlyChange}`;
        monthlyTrendEl.classList.add('trend-up');
    } else if (monthlyChange < 0) {
        monthlyTrendEl.innerHTML = `<i class="bi bi-arrow-down"></i> ${monthlyChange}`;
        monthlyTrendEl.classList.add('trend-down');
    } else {
        monthlyTrendEl.textContent = 'No change';
    }
    
    // Cost savings calculation: (unique authors - 1) * cost per user
    const costSavings = (data.uniqueAuthors - 1) * config.costPerUser;
    document.getElementById('cost-savings').textContent = `$${costSavings}`;
    document.getElementById('avg-time').textContent = data.avgReviewTime;
}

// Populate recent reviews table
function populateRecentReviews(reviews = mockData.recentReviews) {
    const recentReviewsEl = document.getElementById('recent-reviews');
    recentReviewsEl.innerHTML = '';
    
    reviews.forEach(review => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="text-decoration-none">${review.pr}</a> ${review.title}</td>
            <td>${review.author}</td>
            <td>${review.bot}</td>
            <td>${review.date}</td>
            <td><span class="badge bg-${review.outcome === 'approved' ? 'success' : 'warning'}">${review.outcome}</span></td>
        `;
        recentReviewsEl.appendChild(row);
    });
}

// Create charts
function createCharts(data = mockData) {
    // Reviews over time chart
    const reviewsChartCtx = document.getElementById('reviews-chart').getContext('2d');
    const reviewsChart = new Chart(reviewsChartCtx, {
        type: 'line',
        data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{
                label: 'Monthly Reviews',
                data: data.reviewsByMonth,
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Reviews: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
    
    // Review outcomes chart
    const outcomesChartCtx = document.getElementById('outcomes-chart').getContext('2d');
    const outcomesChart = new Chart(outcomesChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Needs Changes', 'Needs Review'],
            datasets: [{
                data: [
                    data.outcomes.approved,
                    data.outcomes.needsChanges,
                    data.outcomes.needsReview
                ],
                backgroundColor: [
                    '#198754',
                    '#ffc107',
                    '#0dcaf0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Fetch real data from GitHub API (protected behind authentication)
async function fetchRealData() {
    try {
        document.querySelector('.alert-info').classList.remove('alert-danger');
        document.querySelector('.alert-info').innerHTML = '<strong>Note:</strong> Fetching the latest data...';
        
        // In a production environment, you would need to authenticate and fetch real data
        // This would be implemented with a server-side component for security
        /*
        const response = await fetch('/api/dashboard-stats');
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        updateMetrics(data);
        populateRecentReviews(data.recentReviews);
        createCharts(data);
        */
        
        // Update the alert to show when data was last refreshed
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.querySelector('.alert-info').innerHTML = 
            `<strong>Note:</strong> This dashboard displays metrics for CodeRabbit reviews triggered by the central bot account. <span class="text-muted">(Last updated: ${timeString})</span>`;
            
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.alert-info').classList.add('alert-danger');
        document.querySelector('.alert-info').innerHTML = '<strong>Error:</strong> Failed to load data. ' + error.message;
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initDashboard);