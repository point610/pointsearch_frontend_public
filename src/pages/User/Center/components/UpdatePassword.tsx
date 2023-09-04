import React, {useState} from "react";
import {Button, Card, Descriptions, Divider, Input, message, theme} from "antd";
import {history, useModel} from "@@/exports";
import {updateMyPasswordUsingPOST} from "@/services/pointsearch_backend/userController";


const UpdatePassword: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const {token} = theme.useToken();
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [checkPasswordVisible, setCheckPasswordVisible] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [userUpdatePasswordRequest] = useState<API.UserUpdatePasswordRequest>({})

  const loginPath = '/user/login';

  const clickButton = async () => {
    setButtonDisabled(true)
    userUpdatePasswordRequest.oldPassword = oldPassword
    userUpdatePasswordRequest.newPassword = newPassword
    userUpdatePasswordRequest.checkPassword = checkPassword
    const res = await updateMyPasswordUsingPOST(userUpdatePasswordRequest)
    if (res.data === true) {
      message.success("修改密码成功")
      setInitialState({});
      history.push(loginPath)
    } else {
      message.error(res.message)
    }
    setButtonDisabled(false)
  }

  const changeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };
  const changeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };


  const changeCheckPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value);
  };


  return (
    <Card
      style={{
        borderRadius: 8,
      }}
      bodyStyle={{
        backgroundImage:
          initialState?.settings?.navTheme === 'realDark'
            ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
            : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
      }}>
      <div
        style={{
          backgroundPosition: '100% -30%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '274px auto',
          backgroundImage:
            "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
        }}>
        <div
          style={{
            fontSize: '23px',
            color: token.colorTextHeading,
          }}> 修改密码
        </div>
        <Divider/>
        <Descriptions column={1}>
          <Descriptions.Item>
                <span style={{
                  fontSize: '19px',
                  width: '100px'
                }}>旧的密码:</span>
            <Input.Password size={"large"}
                            placeholder="input old password"
                            visibilityToggle={{visible: oldPasswordVisible, onVisibleChange: setOldPasswordVisible}}
                            onChange={changeOldPassword}/>
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
                <span style={{
                  fontSize: '19px',
                  width: '100px'
                }}>新的密码:</span>
            <Input.Password size={"large"}
                            placeholder="input new password"
                            visibilityToggle={{visible: newPasswordVisible, onVisibleChange: setNewPasswordVisible}}
                            onChange={changeNewPassword}/>
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
                <span style={{
                  fontSize: '19px',
                  width: '100px'
                }}>检测密码:</span>
            <Input.Password size={"large"}
                            placeholder="input check password"
                            visibilityToggle={{visible: checkPasswordVisible, onVisibleChange: setCheckPasswordVisible}}
                            onChange={changeCheckPassword}/>
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
            <Button type="primary" size={"large"} onClick={clickButton} disabled={buttonDisabled}>修改密码</Button>
          </Descriptions.Item>
        </Descriptions>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}>
        </div>
      </div>
    </Card>
  );
};
export default UpdatePassword;
