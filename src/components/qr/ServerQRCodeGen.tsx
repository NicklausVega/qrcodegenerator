import React from "react";
import QRCodeStyling, {
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  Options,
} from "qr-code-styling";
import { JSDOM } from "jsdom";
import nodeCanvas from "canvas";

interface ServerQRCodeGenProps {
  data: string;
  width?: number;
  height?: number;
  image?: string;
  dotsColor?: string;
  backgroundColor?: string;
  className?: string;
}

const ServerQRCodeGen: React.FC<ServerQRCodeGenProps> = async ({
  data,
  width = 300,
  height = 300,
  image,
  dotsColor = "#222222",
  backgroundColor = "#5FD4F3",
  className,
}) => {
  const options: Options = {
    width,
    height,
    type: 'svg',
    jsdom: JSDOM,
    nodeCanvas,
    data,
    image,
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
    },
    imageOptions: {
      saveAsBlob: true,
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: dotsColor,
      type: 'rounded'
    },
    backgroundOptions: {
      color: backgroundColor,
    },
  };

  try {
    const qrCode = new QRCodeStyling(options);
    const buffer = await qrCode.getRawData("svg");
    const svg = buffer?.toString();

    if (!svg) {
      return (
        <div className={className}>
          <p>Failed to generate QR code</p>
        </div>
      );
    }

    return (
      <div className={className}>
        <div 
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ 
            display: 'inline-block',
            lineHeight: 0
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error generating QR code:', error);
    return (
      <div className={className}>
        <p>Error generating QR code</p>
      </div>
    );
  }
};

export default ServerQRCodeGen;
