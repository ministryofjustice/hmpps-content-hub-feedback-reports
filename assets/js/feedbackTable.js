function cleanColumnOutput(data) {
  const unsafeOutputPattern = />|<|&|"|\/|'/g
  return data.replace(unsafeOutputPattern, '')
}

function createTable({
  id,
  ajaxUrl,
  data,
  orderColumn,
  orderType,
  columns,
  pageLength = 10,
  columnDropdowns = false,
  columnSearchText = true,
}) {
  const ajax = ajaxUrl && {
    url: ajaxUrl,
    dataSrc: '',
    error: function () {
      if (ajaxUrl !== undefined) {
        alert('An error occurred when loading table data.') // eslint-disable-line no-undef
      }
    },
  }

  return new DataTable(`#${id}`, {
    layout: {
      bottomStart: {
        buttons: [
          'colvis',
          {
            extend: 'copy',
            exportOptions: {
              columns: ':visible',
            },
          },
          {
            extend: 'csv',
            exportOptions: {
              columns: ':visible',
            },
          },
        ],
      },
    },
    lengthMenu: [
      [10, 25, 50, 75, 100, -1],
      [10, 25, 50, 75, 100, 'All'],
    ],
    pageLength,
    paging: true,
    pagingType: 'simple_numbers',
    order: [[orderColumn, orderType]],
    sortable: true,
    ajax,
    data,
    columns,
    initComplete: function () {
      if (columnDropdowns) {
        this.api()
          .columns()
          .every(function () {
            const column = this

            // Create select element
            const select = document.createElement('select')
            select.add(new Option(''))
            column.footer().replaceChildren(select)

            // Apply listener for user change in value
            select.addEventListener('change', function () {
              column.search(select.value, { exact: true }).draw()
            })

            // Add list of options
            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.add(new Option(d))
              })
          })
      }
      if (columnSearchText) {
        this.api()
          .columns()
          .every(function () {
            const column = this
            const title = column.footer().textContent + ' (regex)'

            // Create input element
            const input = document.createElement('input')
            input.placeholder = title
            column.footer().replaceChildren(input)

            // Event listener for user input
            input.addEventListener('keyup', () => {
              if (column.search() !== this.value) {
                const regex = true
                const smart = false
                column.search(input.value, regex, smart).draw()
              }
            })
          })
      }
    },
  })
}

function formatMonitorName(name) {
  return `${name} `
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^-a-z0-9]/g, '')
    .replace(/-+/g, '-')
}

jQuery(function () {
  const columns = [
    {
      data: 'title',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'establistment',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'contentType',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'sentiment',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'comment',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'date',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'categories',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    {
      data: 'series',
      // createdCell: function (td, _cellData, rowData) {
      //   $(td).html(`<a href="/teams/${rowData.attributes.slug}">${rowData.attributes.name}</a>`)
      // },
    },
    // {
    //   data: 'attributes.slack_channel_name',
    //   createdCell: function (td, _cellData, rowData) {
    //     if (rowData.attributes.slack_channel_id)
    //       $(td).html(
    //         `<a href="slack://channel?team=T02DYEB3A&id=${rowData.attributes.slack_channel_id}">#${rowData.attributes.slack_channel_name}</a>`,
    //       )
    //   },
    // },
    // {
    //   data: 'attributes.products',
    //   createdCell: function (td, _cellData, rowData) {
    //     const products = rowData.attributes.products.data
    //       .map(
    //         product =>
    //           `<li><a href="/products/${product.attributes.slug}" data-test="product-${product.id}">${product.attributes.name}</a></li>`,
    //       )
    //       .join('')
    //     if (products) {
    //       $(td).html(`${products}`)
    //     } else {
    //       $(td).html(`No Products`)
    //     }
    //   },
    // },
    // {
    //   data: 'attributes.slug',
    //   createdCell: function (td, _cellData, rowData) {
    //     const monitor_name = `${formatMonitorName(rowData.attributes.name)}`
    //     $(td).html(
    //       `<details class="govuk-details"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Links</span></summary><li><a class="govuk-link--no-visited-state" href="/monitor/team/${monitor_name}">Health Monitor</a></li><li><a class="govuk-link--no-visited-state" href="/drift-radiator/teams/${monitor_name}">Deployment drift</a></li><li><a class="govuk-link--no-visited-state" href="/trivy/teams/${monitor_name}">Trivy</a></li>`,
    //     )
    //   },
    // },
  ]

  createTable({ id: 'feedbackTable', ajaxUrl: '/reports/data', orderColumn: 4, orderType: 'desc', columns })
})
