
import  React, { Component } from 'react';

import { Form, Input, Row, Col,Button} from 'antd';
import IconUtils from '../../api/utils/IconUtils';
import RefListField from '../Field/RefListField';
import RefTableField from '../Field/RefTableField';
import I18NUtils from '../../api/utils/I18NUtils';
import {i18NCode} from '../../api/const/i18n';
import { RefTableName, SystemRefListName } from '../../api/const/ConstDefine';
import UserManagerRequest from '../../api/user-manager/UserManagerRequest';
import { Link } from 'react-router-dom';
import FoundationSymbol from 'foundation-symbol';
import MessageUtils from '../../api/utils/MessageUtils';
import ChangeOverduePwdForm from './ChangeOverduePwdForm';
import { Notification } from '../notice/Notice';

const FormItem = Form.Item;


class UserLoginForm extends Component {

    static displayName = 'UserLoginForm';

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            language: "Chinese",
            org: "1",
            checkbox: false,
            changePwdVisiable: false,
        };
    }

    createChangePwdForm = () => {
      const WrappedChangePwdForm = Form.create()(ChangeOverduePwdForm);
      return  <WrappedChangePwdForm 
                            object={{}} 
                            visible={this.state.changePwdVisiable} 
                            username={this.state.username}
                            destroyOnClose
                            onOk={this.changePwdOk} 
                            onCancel={this.canelChangePwd}/>
    }

    changePassword = (e) => {
      debugger;
      let self = this;
      let username = self.username.state.value;
      if(username == null || username == "" || username == undefined){
        Notification.showNotice("用户名密码不能为空！");
          return;
      }
      e.preventDefault();
      this.setState({
        changePwdVisiable: true,
        username: username
      })
    } 

    changePwdOk = () => {
      MessageUtils.showOperationSuccess();
      this.setState({changePwdVisiable: false})
    }
    
    canelChangePwd = () => {
      this.setState({changePwdVisiable: false})
    }

    handleLogin = () => {
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let object = {
                user: values,
                success: (responseBody) => this.props.handleOk(responseBody, values.org, values.language)
            }
            UserManagerRequest.sendLoginRequest(object);
        });
    }

    buildLoginForm = () => {
        const {getFieldDecorator} = this.props.form;    
        return (
         <Form>
            <div style={styles.formItems}>
              <Row>
                <Col>
                  <FormItem>
                    {getFieldDecorator('username',{
                        initialValue:this.state.username,
                        rules: [{
                            required: true
                        }]
                    })(
                        <Input ref={(username) => { this.username = username }}  prefix={IconUtils.buildIcon("icon-renyuan")} maxLength={20} />
                      )}
                  </FormItem>
                </Col>
              </Row>
    
              <Row>
                <Col>
                  <FormItem>
                      {getFieldDecorator('password',{
                            initialValue:this.state.password,
                            rules: [{
                                required: true
                            }]
                        })(
                          <Input prefix={IconUtils.buildIcon("lock")}  type="password" />
                        )}
                  </FormItem>
                </Col>
              </Row>
              <Row >
                <Col>
                  {IconUtils.buildIcon("icon-location", "", styles.selectIcon)}
                  <FormItem>
                      {getFieldDecorator('org',{
                            initialValue:this.state.org,
                            rules: [{
                                required: true
                            }]
                        })(
                          <RefTableField initialValue={this.state.org} field = {{refTableName : RefTableName.NBOrg}} style={styles.formSelect} />
                        )}
                  </FormItem>
                </Col>
              </Row>
    
              <Row >
                <Col>
                  {IconUtils.buildIcon("icon-language", "", styles.selectIcon)}
                  <FormItem>
                      {getFieldDecorator('language', {
                          initialValue:this.state.language,
                          rules: [{
                            required: true
                          }]
                        })(
                          <RefListField initialValue={this.state.language} field={{name:"language", form:this.props.form}} referenceName={SystemRefListName.Language} style={styles.formSelect}/>
                        )}
                  </FormItem>
                </Col>
              </Row>           
              <Row >
                <Button type="primary" onClick={this.handleLogin} style={styles.submitBtn}>
                  {I18NUtils.getClientMessage(i18NCode.Login)}
                </Button>
              </Row>
              {
              <Row className="tips" style={styles.tips}>
                <Link to="/" onClick={this.changePassword}>
                  <FoundationSymbol style={styles.link} size="small" />修改密码
                </Link>
              </Row>      
              }
            </div>
            
         </Form> 
        )
    }

    render() {
        return (
            <div>
                {this.buildLoginForm()}
                {this.createChangePwdForm()}
            </div>
        )
    }

}
const styles = {
    formSelect: {
      marginLeft: "20px",
      width: "90%"
    },
    selectIcon: {
      position: 'absolute',
      left: '-4px',
      top: '5px',
      color: '#999',
    },
  
    submitBtn: {
      width: '240px',
      background: '#3080fe',
      borderRadius: '28px',
    },
    tips: {
      textAlign: 'center',
    },
    link: {
      color: '#999',
      textDecoration: 'none',
      fontSize: '13px',
    },
    line: {
      color: '#dcd6d6',
      margin: '0 8px',
    },
  };
export default Form.create({ name: 'login-form' })(UserLoginForm);