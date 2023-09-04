import {useEmotionCss} from '@ant-design/use-emotion-css';
import React from 'react';
import {Image} from 'antd';

const Login: React.FC = () => {
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  return (
    <div className={containerClassName}>
      <p></p>
      <p></p>
      <p></p>
      <div
        style={{
          textAlign: 'center',
          flex: '1',
          padding: '32px 0',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
        <p>请联系管理员</p>
        <Image
          width={400}
          src="/adminAvatar.png"
        />
      </div>
    </div>
  )
    ;
};

export default Login;
