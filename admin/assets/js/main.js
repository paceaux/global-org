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
				<th id="_id">_id</th>
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
		let url = app.server.origin + '/employees/remove';
		const xhr = new XMLHttpRequest();
		let newState = this.state;
		xhr.open('DELETE', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = () => {
			if (xhr.status === 200 && xhr.readyState === 4) {
				for (let employee in newState) {

					if (newState[employee]._id == employeeKey) {
						delete  newState[employee];
					}
				}
				console.log(xhr.status);
				this.setState(newState);

			} else {
				console.warn('Request did not work', xhr.status);
			}
		}
		xhr.send(JSON.stringify({"_id": employeeKey}));

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

class EmployeeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value:event.target.value});
		console.log(event);
	}

	handleSubmit(event) {
		alert('a name was submitted' + this.state.value);
		event.preventDefault();
	}

	render() {
		return (

			<form onSubmit={this.handleSubmit}>
				<fieldset class="form__fieldset">
					<legend class="form__legend">Name</legend>
					<input class="form__input input input--text" type="text" placeholder="first name" name="first-name" value={this.state.value} onChange={this.handleChange}/>
					<input class="form__input input input--text" type="text" placeholder="last name" name="last-name" value={this.state.value} onChange={this.handleChange}/>
				</fieldset>
				<fieldset class="form__fieldset">
				<button class="form__button button button--submit">submit</button>
				</fieldset>
			</form>
		)
	}
}

var app;

app = {
	selectors : {
		employeeForm: '.js-employeeForm',
	},
	server: {
		protocol: 'http',
		hostname: 'localhost',
		port: 8080,
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
		let url = this.server.origin + '/employees/add';

		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function () {
			if (xhr.status === 200) {
				console.info(xhr.responseText);
			} else {
				console.warn('Request did not work', xhr.status);
			}
		}

		xhr.send(JSON.stringify(employeeData));
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
			this.buildTable();
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
ReactDOM.render (
	<EmployeeForm  />,
	document.getElementById('employeeformcontainer')
);
app.init();



