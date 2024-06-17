import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';

export async function setupRedoc(app: INestApplication | any) {
  const config = new DocumentBuilder()
    .setTitle('Screenify')
    .setDescription('Screenify')
    .addCookieAuth('Authentication', {
      type: 'http',
      in: 'cookie',
      scheme: 'Bearer',
    })
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const redocOptions: RedocOptions = {
    title: 'Screenify',
    logo: {
      url: 'https://google.com',
      backgroundColor: '#d0e8c5',
      altText: 'Screenify',
    },
    theme: {
      typography: {
        fontSize: '16px',
        fontWeightBold: '900',
      },
      sidebar: {
        backgroundColor: '#d0e8c5',
      },
      rightPanel: {
        backgroundColor: '#13105E',
      },
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    noAutoAuth: true,
    pathInMiddlePanel: true,
  };
  await RedocModule.setup('docs', app, document, redocOptions);
  console.info('Screenify API Docs: http://localhost:4000/docs');
}
