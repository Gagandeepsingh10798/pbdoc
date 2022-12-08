cd /home/centos/;
rm -rf pb-uc-mid-market

cd latestProject
mv pb-uc-mid-market ../
cd ..

cd pb-uc-mid-market

rm src-framework/framework-config.js;
cp environments/single-server/configs/server/framework-config.js src-framework/framework-config.js;

rm src-application/application-config.js;
cp environments/single-server/configs/server/application-config.js src-application/application-config.js;

rm src-messaging/messaging-config.js;
cp environments/single-server/configs/server/messaging-config.js src-messaging/messaging-config.js;

rm src-idp-ui/config.js;
rm src-idp-ui/config.json;

cp environments/single-server/configs/idp-ui/config.js src-idp-ui/config.js;
cp environments/single-server/configs/idp-ui/config.json src-idp-ui/config.json;

rm src-admin-ui/config.js;
rm src-admin-ui/config.json;

cp environments/single-server/configs/admin-ui/config.js src-admin-ui/config.js;
cp environments/single-server/configs/admin-ui/config.json src-admin-ui/config.json;

rm src-external-ui/config.js;
cp environments/single-server/configs/external-ui/config.js src-external-ui/config.js;

pm2 delete all || :;

rm -rf /usr/share/nginx/html/src-admin-ui;
rm -rf /usr/share/nginx/html/src-external-ui;
rm -rf /usr/share/nginx/html/src-idp-ui;

cp -R src-admin-ui/ ../../../usr/share/nginx/html/
cp -R src-external-ui/ ../../../usr/share/nginx/html/
cp -R src-idp-ui/ ../../../usr/share/nginx/html/

cd src-database;
NODE_ENV=production pm2 start database-start.js --watch --name=stagingOctopusDatabasePlatform;
sleep 120;
cd ..;
cd src-messaging;
NODE_ENV=production pm2 start messaging-start.js --watch --name=stagingOctopusMessagingPlatform;
sleep 30;
cd ..;
cd src-application;
NODE_ENV=production pm2 start application-start.js --watch --name=stagingOctopusApplicationPlatform;
sleep 30;
cd ..;
cd src-services;
NODE_ENV=production pm2 start services-start.js --watch --name=stagingOctopusServicePlatform;
cd ..;
pm2 save;