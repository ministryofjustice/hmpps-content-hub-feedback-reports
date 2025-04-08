google.charts.load('current', { packages: ['corechart', 'bar'] })
google.charts.setOnLoadCallback(drawCharts)

function drawCharts() {
  const contentTypeChartData = google.visualization.arrayToDataTable(contentTypeData)
  const sentimentChartData = google.visualization.arrayToDataTable(sentimentData)
  const commentChartData = google.visualization.arrayToDataTable(commentData)

  const contentTypeOptions = {
    title: 'Content Type',
    chartArea: { height: '150%', left: 350 },
    hAxis: {
      title: 'Count',
      minValue: 0,
    },
    vAxis: {
      title: 'Content Type',
    },
  }

  const commentBarOptions = {
    title: 'Comment',
    chartArea: { height: '250%' },
    hAxis: {
      title: 'Count',
      minValue: 0,
    },
    vAxis: {
      title: 'Comment',
    },
  }

  const pieChartOptions = {
    chartArea: {
      height: '200%',
    },
  }

  const contentTypeChart = new google.visualization.BarChart(document.getElementById('contentTypeChart'))
  const sentimentChart = new google.visualization.PieChart(document.getElementById('sentimentChart'))
  const commentBarChart = new google.visualization.BarChart(document.getElementById('commentBarChart'))
  const commentPieChart = new google.visualization.PieChart(document.getElementById('commentPieChart'))

  contentTypeChart.draw(contentTypeChartData, contentTypeOptions)
  sentimentChart.draw(sentimentChartData, pieChartOptions)
  commentBarChart.draw(commentChartData, contentTypeOptions)
  commentPieChart.draw(commentChartData, pieChartOptions)
}
