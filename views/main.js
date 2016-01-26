var React = require('react');
var ReactDOM = require('react-dom');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

var MainTemplate = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            apiKey: 'currentApiKey1234'
        };
    },
    componentDidMount: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
              console.log(data);
              this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    onApiChange: function(key){
        this.setState({apiKey: key});
    },
    render: function(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <NavBar data={this.state.data} />
                    </div>
                    <div id="content" className="col-md-9">
                        <div id="user-input">
                            <UserInput onApiChange={this.onApiChange} apiKey={this.state.apiKey}/>
                        </div>
                        <MethodList data={this.state.data} apiKey={this.state.apiKey} />
                    </div>
                </div>
            </div>
        );
    }
});

var UserInput = React.createClass({
    randomizeKey: function(event){
        event.preventDefault();
        var randomKey = Math.random().toString(36).slice(2);
        this.props.onApiChange(randomKey);
        $('.apiKey').text(randomKey);
    },
    vIdChange: function(event){
        event.preventDefault();
        var vId = event.target.value;
        vId.length === 0 ? $('.vId').text('{{id}}') : $('.vId').text(vId)
    },
    render:function(){
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1"><strong>API Key</strong></span>
                        <input type="text" className="form-control" id="api" aria-describedby="basic-addon1" value={this.props.apiKey} readOnly/>
                        <span className="input-group-btn">
                            <button className="btn btn-warning" type="button" onClick={this.randomizeKey}><small>Generate New Key</small></button>
                        </span>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon2"><strong>Vehicle ID</strong></span>
                        <input type="text" className="form-control" id="vehicle_id" aria-describedby="basic-addon2" onChange={this.vIdChange} placeholder="Type Your Vehicle ID Here"/>
                    </div>
                </div>
            </div>
        )
    }
})

var NavBar = React.createClass({
    render:function(){
        var menu = this.props.data.map(function(method, index){
            return (
                <li key={index}>
                    <a href={'#item'+index}>
                        {method.title}
                    </a>
                </li>
            )
        })
        return (
            <div id="navbar">
                <ul className="nav nav-pills nav-stacked">
                    {menu}
                </ul>
            </div>
        )
    }
})

var MethodList = React.createClass({
    render: function(){
        var list = this.props.data.map(function(method, index){
            return (
                <Method id={'item'+index} key={index} ref={"method_"+index} method={method} apiKey={this.props.apiKey}/>
            )
        }.bind(this));
        return (
            <div>
                {list}
            </div>
        )
    }
});

var Method = React.createClass({
    componentDidMount: function(){
        var api = this.props.apiKey;
        var example = this.props.method.example;
        example = example.replace('{{id}}', '<span class="text-primary vId">{{id}}</span>');
        example = example.replace('{{apiKey}}', '<span class="text-danger apiKey">'+api+'</span>');
        $('pre').html(example);
    },
    render: function(){
        return (
            <div className="section" id={this.props.id}>
                <div className="doc-header">
                    <h1 className="page-header text-capitalize">{this.props.method.title}</h1>
                </div>
                <h3><code><span className="text-uppercase">{this.props.method.method}</span></code>   <samp><span>{this.props.method.url}</span></samp></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p></p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <h4>Example Request</h4>
                <pre>{this.props.method.example}</pre>
                <div className="row">
                    <div className="col-md-6">
                        <h4>Request Parameters</h4>
                        <ParamTable thead={Object.keys(this.props.method.request[0])}
                                    tbody={this.props.method.request} />
                    </div>
                    <div className="col-md-6">
                        <h4>Response Parameters</h4>
                        <ParamTable thead={Object.keys(this.props.method.response[0])}
                                    tbody={this.props.method.response} />
                    </div>
                </div>
            </div>
        )
    }
})

var ParamTable = React.createClass({
    render: function(){
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        {this.props.thead.map(function(th){
                            return <th key={th} className="text-capitalize">{th}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {this.props.tbody.map(function(tr, i){
                        var td = [];
                        {for(var key in tr){
                            if(key === 'field'){
                                td.push(<td key={'td_'+key}><code>{tr[key]}</code></td>);
                            }else{
                                td.push(<td key={'td_'+key}>{tr[key]}</td>);
                            }
                        }}
                        return (
                            <tr key={'tr_'+i}>
                                {td}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }
})

ReactDOM.render(
  <MainTemplate url="/api" />,
  document.getElementById('main')
);
