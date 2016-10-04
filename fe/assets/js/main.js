

var FieldName = React.createClass({
  render: function() {
    return (
      <th className="table__cell table__cell--head">
      </th>
    );
  }
});

var TableHead = React.createClass({
	render: function () {
		var fieldHeadings = this.props.data.map(function(field) {
			return (
				<th id={field.fieldName}>
					{field.fieldName}
				</th>
			)
		});

		return (
			<tr className="table__row" data={this.props.data}>
				{fieldHeadings}
			</tr>
		)
	}
});


var EmployeeField = React.createClass({
  render: function() {
    return (
      <td className="table__cell">
      </td>
    );
  }
});

var Employee = React.createClass({
	render: function() {
	var employeeFields = this.props.data.map(function(field) {

			return (
				<td for={field.fieldName} >
					{field.fieldValue}
				</td>
			);
		});
	return (
		<tr className="table__row" data={this.props.data}>
			{employeeFields}
		</tr>
	);
	}
});

var app;

app = {
	selectors : {
		employeeForm: '.js-employeeForm',
	},
	FormData: function (form) {
		let nodes = form.querySelectorAll('[name]')
		let formData =  [];


		for (var node of nodes) {
			formData.push({fieldName: node.name,fieldValue: node.value});
		}
		return formData;
	},
	bindEvts: function () {
		const employeeForm = document.querySelector(this.selectors.employeeForm);

		employeeForm.addEventListener('submit',  (e) => {
			e.preventDefault();
			let form  = e.target;
			let formData = this.FormData(form);

			ReactDOM.render(
				<Employee  data={formData}/>,
				document.getElementById('employees__list')
			);
			//this.submit();
		});
	},
	buildTHead: function () {
		let formData = this.FormData(document.querySelector(this.selectors.employeeForm));

		ReactDOM.render(
			<TableHead  data={formData}/>,
			document.getElementById('fields__headings')
		);
	},
	init: function () {
		this.buildTHead();
		this.bindEvts();
	},
};

app.init();



