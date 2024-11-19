#!/bin/bash

aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "00000000000" \
    --user-attributes Name="email",Value="empty@18burguers.com" Name="email_verified",Value="true" \
    --message-action "SUPPRESS" > /dev/null 2>&1


aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "00000000000" \
    --password "00000000000" \
    --permanent
