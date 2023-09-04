import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Descriptions, Divider, Input, message, theme, Typography, Upload} from "antd";
import {useModel} from "@@/exports";
import {changeASKeyUsingPOST, updateMyUserUsingPOST} from "@/services/pointsearch_backend/userController";
import {DownloadOutlined} from "@ant-design/icons";

const {Paragraph} = Typography;
import {history} from 'umi';

const DOWN_PAGE = "http://localhost:8000/welcome";
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
    // 跳转到下载页面
    history.push(DOWN_PAGE)
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
          <span>开发者SDK</span>
        </div>
        <Divider/>
        <Button disabled={buttonDisabled}
                type="primary" icon={<DownloadOutlined/>}
                size={"large"}
                onClick={handButtonClick}>
          Java SDK
        </Button>
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
