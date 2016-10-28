function jsonToQueryString(json) {
    return '?' +
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

class EmployeeField extends React.Component {
	render () {
		return (
			<td className="table__cell" for={data.key}>
				{data.value}
			</td>
		)
	}
}
class TableHead extends React.Component {
	render () {
		return (
			<thead class="table__head" id="fields__headings">
				<tr className="employees__headings table__row" data={this.props.data}>
					{Object.keys(this.props.data).map((key) => {
						return (
							<th id={key}>
								{key}
							</th>
						)
					})}
					<td> </td>
				</tr>
			</thead>
		)
	}
};

class EmployeeControlsEdit extends React.Component {
	render () {
		return (
			<button className="edit">Edit</button>
		)
	}
}


class EmployeeControlsDelete extends React.Component {
	constructor (props) {
		super(props);
	}
	render () {
		return (
			<button className="delete" onClick={()=>this.props.onDelete(this.props.data._id)}>Delete</button>
		)
	}
}

class EmployeeControls extends React.Component {
	render () {
		return (
			<td className="employee__controls">
				<EmployeeControlsEdit />
				<EmployeeControlsDelete data={this.props.data} onDelete={this.props.onDelete}/>
			</td>
		)
	}
}

class Employee extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isVisible: true
		}
	}
	render () {
		return (
			<tr className="table__row" data={this.props.data} id={this.props.data._id} >
				{
					Object.keys(this.props.data).map((key) => {
						return <td headers={key}>{this.props.data[key]}</td>

					})
				}
				<EmployeeControls data={this.props.data} onDelete={this.props.onDelete}/>
			</tr>
		);
	}
};

class EmployeeList extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};


	}
	componentWillMount () {
		const _this = this;
		const xhr = new XMLHttpRequest();
		let url = app.server.origin + '/employees/get/';

		xhr.open('GET', url);
		xhr.onload = () => {
			if (xhr.status === 200 && xhr.readyState === 4) {
				this.setState(JSON.parse(xhr.responseText));
			} else {
				console.warn('Request did not work', xhr.status);
			}
		}
		xhr.send();
	}
	onDeleteEmployee (employeeKey) {
		let url = app.server.origin + '/employees/remove?_id=' + employeeKey;
		const xhr = new XMLHttpRequest();
		let newState = this.state;
		xhr.open('GET', url);
		xhr.onload = () => {
			if (xhr.status === 200 && xhr.readyState === 4) {
				for (let employee in newState) {

					if (newState[employee]._id == employeeKey) {
						delete  newState[employee];
					}
				}
				this.setState(newState);

			} else {
				console.warn('Request did not work', xhr.status);
			}
		}
		xhr.send();

	}
	render () {
		return (
			<tbody className="employees__list" id="employees__list">
				{
					 Object.keys(this.state).map((key)=> {
						return <Employee data={this.state[key]} key={this.state[key]._id} onDelete={this.onDeleteEmployee.bind(this)}/>
					})
				}
			</tbody>
		)
	}
};

class EmployeeTable extends React.Component{
	render () {
		return (
			<table id="employees" className="table">
					<TableHead  data={this.props.data}/>
				<EmployeeList />
			</table>
		)
	}
};

var app;

app = {
	selectors : {
		employeeForm: '.js-employeeForm',
	},
	server: {
		protocol: 'http',
		hostname: 'localhost',
		port: 3000,
		get origin() {
			let port = this.port != '' ? ':' + this.port : '';
			return this.protocol + '://' + this.hostname + port;
		}
	},
	FormData: function (form) {
		let nodes = form.querySelectorAll('[name]')
		let formData =  {};


		for (var node of nodes) {
			formData[node.name] =  node.value;
		}
		return formData;
	},
	getEmployeeData: function () {

	},
	addEmployeeData: function (employeeData) {
		const _this = this;
		const xhr = new XMLHttpRequest();
		let data = jsonToQueryString(employeeData);
		let url = this.server.origin + '/employees/add' + data;

		xhr.open('POST', url);
		xhr.onload = function () {
			if (xhr.status === 200) {
				console.info(xhr.responseText);
			} else {
				console.warn('Request did not work', xhr.status);
			}
		}

		xhr.send();
	},
	bindEvts: function () {
		const employeeForm = document.querySelector(this.selectors.employeeForm);

		employeeForm.addEventListener('submit',  (e) => {
			e.preventDefault();
			let form  = e.target;
			let formData = this.FormData(form);

			console.log('adding formdata', formData);
			this.addEmployeeData(formData);
			console.log(EmployeeList);
		});
	},
	buildTable: function () {
		let formData = this.FormData(document.querySelector(this.selectors.employeeForm));
		ReactDOM.render (
			<EmployeeTable  data={formData}/>,
			document.getElementById('global-employees')
		);
	},
	init: function () {
		this.buildTable();
		this.bindEvts();
	},
};

app.init();



