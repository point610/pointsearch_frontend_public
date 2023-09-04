import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Descriptions, Divider, Input, message, theme, Typography, Upload} from "antd";
import {useModel} from "@@/exports";
import {changeASKeyUsingPOST, updateMyUserUsingPOST} from "@/services/pointsearch_backend/userController";

const {Paragraph} = Typography;

const SettingInfo: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const {token} = theme.useToken();
  const [loginUserVO] = useState<API.LoginUserVO>({...initialState?.loginUser})
  const [buttonDisabled, setButtonDisabled] = useState(false)

  useEffect(() => {
    console.log("initialState")
    console.log(initialState)
  }, [initialState]);
  const handButtonClick = async () => {
    setButtonDisabled(true)
    const res = await changeASKeyUsingPOST()
    if (res.data) {
      message.success("修改成功")
      loginUserVO.accessKey = res.data.accessKey
      loginUserVO.secretKey = res.data.secretKey
      setInitialState({
        loginUser: loginUserVO
      })

    } else {
      message.error("修改失败")
    }
    setButtonDisabled(false)
  }

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
          }}>
          <span>开发者密钥</span>
          <Button disabled={buttonDisabled} style={{float: "right"}} onClick={handButtonClick}>重新生成</Button>
        </div>

        <Divider/>
        <Descriptions column={1}>
          <Descriptions.Item>
                <span style={{
                  fontSize: '19px',
                  width: '110px'
                }}>AccessKey:</span>
            <Paragraph copyable>{loginUserVO.accessKey}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item>
                <span style={{
                  fontSize: '19px',
                  width: '110px'
                }}>SecretKey:</span>
            <Paragraph copyable>{loginUserVO.secretKey}</Paragraph>
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
export default SettingInfo;
