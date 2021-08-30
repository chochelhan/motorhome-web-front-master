#!/bin/bash
AUTH_KEY="AAAAC7XqnkY:APA91bHSorqEpJH7WfhBPyOnOGJ6B8t4P3NqzUB5IjW0HcenP_B17OU1XKeHFfRRtUMrIV6I1957mG27EH7Va3DHhxJRr1vwvIglwmuM7PIftDEWckwhLoAeHYyw0MYT6wt45aqAhjlb"
TOKEN="cf_Q_k1KR1eBCVyAtqMQUJ:APA91bGToDCYBwE7mRNVMmHZu4fncrDm3L8FZUW3xMjdc__1veG5FnQfzOiBXfZ3wdceMaPr1lV_kW4wabOQ-7rLrD88tfPzMT1uHLR2qfmoMndNlqq7BbmhcpYo4iWcqtylZ4TDmaB0"
TOKEN2="fS_eCNOjpkr4s2YYfOS99u:APA91bGyQCfN-Ipv1LvLw7_0yRuWfb3TsnRBdLEy3uvaVYbOOJc501CFUKpEu67FcnkGl71NcBb5m_juwFuOzL2ob60d0k7FhpFyqH6FMYL--3lHZqTOlCFHYk8y4w_u6WvcQfKO_snB"
LINK="https://dev.vaxy.world/main?landingType=DIARY&articleNo=2647&pushId=20"
TITLE="title"
BODY="body"
DATA='{"registration_ids":["'$TOKEN'","'$TOKEN2'"],"priority":"high","notification":{"click_action":"notification_activity","icon":"ic_notification","title":"'$TITLE'","body":"'$BODY'","link":"'$LINK'"},"data":{"icon":"ic_notification","title":"'$TITLE'","body":"'$BODY'","link":"'$LINK'"}}'
echo $DATA
curl -X POST 'https://fcm.googleapis.com/fcm/send' --data "$DATA" \
--header "Authorization: key=$AUTH_KEY" \
--header "Content-Type: application/json" \
--verbose
echo ''