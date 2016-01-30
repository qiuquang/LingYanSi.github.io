
import React,{Component} from 'react'
import ReactDOM,{render} from 'react-dom'


const About = React.createClass({
    getInitialState(){
        // react-router会每次重新构建组件
        console.log('重新渲染了？')
        return {
            option:[],
            list: []
        }
    },
    search(){
        this.setState({
            list: [{name:'ss',title:'222' }],
            option: [{key:'22',value:'ddd'}]
        }, ()=>{
            this.forceUpdate()
        })
    },
    selectChange(index, event){
        return
    },
    keyNum: 0 ,
    render(){
        let P = this.state.list.map((item, index)=>{
            return <div key={this.keyNum++}>
                    <span>{item.name}</span>
                    <span>{item.title}</span>
                    <select name="" id=""  onChange={this.selectChange.bind(this,index)}>
                        <option value="">选择</option>
                        {
                            this.state.option.map((ele)=>{
                                return <option value={ele.value}>{ele.key}</option>
                            })
                        }
                    </select>
                    </div>
        })

        return <div>
            <h1>关于</h1> <button onClick={this.search}>Search</button>
            {P}
        </div>
    }
})

export default About 
