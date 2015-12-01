/**
 * @name ChannelExploreController
 * @desc Controller for the channel-explore view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelExploreController', ChannelExploreController);

        ChannelExploreController.$inject = ['$log',
                                           '$rootScope',
                                           '$scope',
                                           '$state',
                                           '$modal',
                                           '$location',
                                           '$timeout',
                                           '$anchorScroll',
                                           'lodash',
                                           'moment',
                                           'ngToast',
                                           'dropboxChooser',
                                           'messageType',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'authService',
                                           'integrationService',
                                           'chatService',
                                           'channelService',
                                           'user',
                                           'project',
                                           'channel',
                                           'isDirect'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $scope,
                                          $state,
                                          $modal,
                                          $location,
                                          $timeout,
                                          $anchorScroll,
                                          lodash,
                                          moment,
                                          ngToast,
                                          dropboxChooser,
                                          messageType,
                                          dialogService,
                                          dashboardServiceModel,
                                          authService,
                                          integrationService,
                                          chatService,
                                          channelService,
                                          user,
                                          project,
                                          channel,
                                          isDirect) {

          var vm = this;
          vm.project = project;
          vm.channel = channel;
          vm.isClosed = false;
          vm.isDirect = isDirect;
          vm.validationErrors = null;
          vm.isMember = false;
          vm.message = null;
          vm.messages = [];
          // messages
          vm.lastMessage = null;
          vm.getMember = getMember;
          vm.getMessageClass = getMessageClass;
          vm.messageIsFromUser = messageIsFromUser;
          vm.formatMessageDate = formatMessageDate;
          vm.sendUserMessage = sendUserMessage;
          vm.loadOlderMessages = loadOlderMessages;
          var nextRequestOffset = 0;
          vm.emptyChannel = false;
          vm.noMoreMessages = false;
          // files
          vm.addDropboxFile = addDropboxFile;
          vm.displayFileMenu = displayFileMenu;
          // update info
          vm.edit = edit;
          // invite / delete members
          vm.showMembers = false;
          vm.showIntegrations = false;
          vm.invite = invite;
          vm.canInvite = canInvite;
          vm.deleteMember = deleteMember;
          // exit from the channel
          vm.exit = exit;
          //close channel
          vm.imSure = false;
          vm.closeChannel = closeChannel;
          //delete channel
          vm.imSureDelete = false;
          vm.deleteChannel = deleteChannel;
          // integrations
          vm.integrationsConfigured = [];
          // emoji
          vm.showEmoji = false;
          vm.displayEmoji = displayEmoji;
          vm.setEmoji = setEmoji;
          vm.emojiList = ["bowtie", "smile", "laughing", "blush", "smiley", "relaxed", "smirk", "heart_eyes", "kissing_heart", "kissing_closed_eyes", "flushed", "relieved", "satisfied", "grin", "wink", "stuck_out_tongue_winking_eye", "stuck_out_tongue_closed_eyes", "grinning", "kissing", "winky_face", "kissing_smiling_eyes", "stuck_out_tongue", "sleeping", "worried", "frowning", "anguished", "open_mouth", "grimacing", "confused", "hushed", "expressionless", "unamused", "sweat_smile", "sweat", "wow", "disappointed_relieved", "weary", "pensive", "disappointed", "confounded", "fearful", "cold_sweat", "persevere", "cry", "sob", "joy", "astonished", "scream", "neckbeard", "tired_face", "angry", "rage", "triumph", "sleepy", "yum", "mask", "sunglasses", "dizzy_face", "imp", "smiling_imp", "neutral_face", "no_mouth", "innocent", "alien", "yellow_heart", "blue_heart", "purple_heart", "heart", "green_heart", "broken_heart", "heartbeat", "heartpulse", "two_hearts", "revolving_hearts", "cupid", "sparkling_heart", "sparkles", "star", "star2", "dizzy", "boom", "collision", "anger", "exclamation", "question", "grey_exclamation", "grey_question", "zzz", "dash", "sweat_drops", "notes", "musical_note", "fire", "hankey", "poop", "shit", "\\+1", "thumbsup", "-1", "thumbsdown", "ok_hand", "punch", "facepunch", "fist", "v", "wave", "hand", "raised_hand", "open_hands", "point_up", "point_down", "point_left", "point_right", "raised_hands", "pray", "point_up_2", "clap", "muscle", "metal", "fu", "walking", "runner", "running", "couple", "family", "two_men_holding_hands", "two_women_holding_hands", "dancer", "dancers", "ok_woman", "no_good", "information_desk_person", "raising_hand", "bride_with_veil", "person_with_pouting_face", "person_frowning", "bow", "couplekiss", "couple_with_heart", "massage", "haircut", "nail_care", "boy", "girl", "woman", "man", "baby", "older_woman", "older_man", "person_with_blond_hair", "man_with_gua_pi_mao", "man_with_turban", "construction_worker", "cop", "angel", "princess", "smiley_cat", "smile_cat", "heart_eyes_cat", "kissing_cat", "smirk_cat", "scream_cat", "crying_cat_face", "joy_cat", "pouting_cat", "japanese_ogre", "japanese_goblin", "see_no_evil", "hear_no_evil", "speak_no_evil", "guardsman", "skull", "feet", "lips", "kiss", "droplet", "ear", "eyes", "nose", "tongue", "love_letter", "bust_in_silhouette", "busts_in_silhouette", "speech_balloon", "thought_balloon", "feelsgood", "finnadie", "goberserk", "godmode", "hurtrealbad", "rage1", "rage2", "rage3", "rage4", "suspect", "trollface", "sunny", "umbrella", "cloud", "snowflake", "snowman", "zap", "cyclone", "foggy", "ocean", "cat", "dog", "mouse", "hamster", "rabbit", "wolf", "frog", "tiger", "koala", "bear", "pig", "pig_nose", "cow", "boar", "monkey_face", "monkey", "horse", "racehorse", "camel", "sheep", "elephant", "panda_face", "snake", "bird", "baby_chick", "hatched_chick", "hatching_chick", "chicken", "penguin", "turtle", "bug", "honeybee", "ant", "beetle", "snail", "octopus", "tropical_fish", "fish", "whale", "whale2", "dolphin", "cow2", "ram", "rat", "water_buffalo", "tiger2", "rabbit2", "dragon", "goat", "rooster", "dog2", "pig2", "mouse2", "ox", "dragon_face", "blowfish", "crocodile", "dromedary_camel", "leopard", "cat2", "poodle", "paw_prints", "bouquet", "cherry_blossom", "tulip", "four_leaf_clover", "rose", "sunflower", "hibiscus", "maple_leaf", "leaves", "fallen_leaf", "herb", "mushroom", "cactus", "palm_tree", "evergreen_tree", "deciduous_tree", "chestnut", "seedling", "blossom", "ear_of_rice", "shell", "globe_with_meridians", "sun_with_face", "full_moon_with_face", "new_moon_with_face", "new_moon", "waxing_crescent_moon", "first_quarter_moon", "waxing_gibbous_moon", "full_moon", "waning_gibbous_moon", "last_quarter_moon", "waning_crescent_moon", "last_quarter_moon_with_face", "first_quarter_moon_with_face", "moon", "earth_africa", "earth_americas", "earth_asia", "volcano", "milky_way", "partly_sunny", "octocat", "squirrel", "bamboo", "gift_heart", "dolls", "school_satchel", "mortar_board", "flags", "fireworks", "sparkler", "wind_chime", "rice_scene", "jack_o_lantern", "ghost", "santa", "christmas_tree", "gift", "bell", "no_bell", "tanabata_tree", "tada", "confetti_ball", "balloon", "crystal_ball", "cd", "dvd", "floppy_disk", "camera", "video_camera", "movie_camera", "computer", "tv", "iphone", "phone", "telephone", "telephone_receiver", "pager", "fax", "minidisc", "vhs", "sound", "speaker", "mute", "loudspeaker", "mega", "hourglass", "hourglass_flowing_sand", "alarm_clock", "watch", "radio", "satellite", "loop", "mag", "mag_right", "unlock", "lock", "lock_with_ink_pen", "closed_lock_with_key", "key", "bulb", "flashlight", "high_brightness", "low_brightness", "electric_plug", "battery", "calling", "email", "mailbox", "postbox", "bath", "bathtub", "shower", "toilet", "wrench", "nut_and_bolt", "hammer", "seat", "moneybag", "yen", "dollar", "pound", "euro", "credit_card", "money_with_wings", "e-mail", "inbox_tray", "outbox_tray", "envelope", "incoming_envelope", "postal_horn", "mailbox_closed", "mailbox_with_mail", "mailbox_with_no_mail", "door", "smoking", "bomb", "gun", "hocho", "pill", "syringe", "page_facing_up", "page_with_curl", "bookmark_tabs", "bar_chart", "chart_with_upwards_trend", "chart_with_downwards_trend", "scroll", "clipboard", "calendar", "date", "card_index", "file_folder", "open_file_folder", "scissors", "pushpin", "paperclip", "black_nib", "pencil2", "straight_ruler", "triangular_ruler", "closed_book", "green_book", "blue_book", "orange_book", "notebook", "notebook_with_decorative_cover", "ledger", "books", "bookmark", "name_badge", "microscope", "telescope", "newspaper", "football", "basketball", "soccer", "baseball", "tennis", "8ball", "rugby_football", "bowling", "golf", "mountain_bicyclist", "bicyclist", "horse_racing", "snowboarder", "swimmer", "surfer", "ski", "spades", "hearts", "clubs", "diamonds", "gem", "ring", "trophy", "musical_score", "musical_keyboard", "violin", "space_invader", "video_game", "black_joker", "flower_playing_cards", "game_die", "dart", "mahjong", "clapper", "memo", "pencil", "book", "art", "microphone", "headphones", "trumpet", "saxophone", "guitar", "shoe", "sandal", "high_heel", "lipstick", "boot", "shirt", "tshirt", "necktie", "womans_clothes", "dress", "running_shirt_with_sash", "jeans", "kimono", "bikini", "ribbon", "tophat", "crown", "womans_hat", "mans_shoe", "closed_umbrella", "briefcase", "handbag", "pouch", "purse", "eyeglasses", "fishing_pole_and_fish", "coffee", "tea", "sake", "baby_bottle", "beer", "beers", "cocktail", "tropical_drink", "wine_glass", "fork_and_knife", "pizza", "hamburger", "fries", "poultry_leg", "meat_on_bone", "spaghetti", "curry", "fried_shrimp", "bento", "sushi", "fish_cake", "rice_ball", "rice_cracker", "rice", "ramen", "stew", "oden", "dango", "egg", "bread", "doughnut", "custard", "icecream", "ice_cream", "shaved_ice", "birthday", "cake", "cookie", "chocolate_bar", "candy", "lollipop", "honey_pot", "apple", "green_apple", "tangerine", "lemon", "cherries", "grapes", "watermelon", "strawberry", "peach", "melon", "banana", "pear", "pineapple", "sweet_potato", "eggplant", "tomato", "corn", "house", "house_with_garden", "school", "office", "post_office", "hospital", "bank", "convenience_store", "love_hotel", "hotel", "wedding", "church", "department_store", "european_post_office", "city_sunrise", "city_sunset", "japanese_castle", "european_castle", "tent", "factory", "tokyo_tower", "japan", "mount_fuji", "sunrise_over_mountains", "sunrise", "stars", "themoreyouknow", "tmyk", "statue_of_liberty", "bridge_at_night", "carousel_horse", "rainbow", "ferris_wheel", "fountain", "roller_coaster", "ship", "speedboat", "boat", "sailboat", "rowboat", "anchor", "rocket", "airplane", "helicopter", "steam_locomotive", "tram", "mountain_railway", "bike", "aerial_tramway", "suspension_railway", "mountain_cableway", "tractor", "blue_car", "oncoming_automobile", "car", "red_car", "taxi", "oncoming_taxi", "articulated_lorry", "bus", "oncoming_bus", "rotating_light", "police_car", "oncoming_police_car", "fire_engine", "ambulance", "minibus", "truck", "train", "station", "train2", "bullettrain_front", "bullettrain_side", "light_rail", "monorail", "railway_car", "trolleybus", "ticket", "fuelpump", "vertical_traffic_light", "traffic_light", "warning", "construction", "beginner", "atm", "slot_machine", "busstop", "barber", "hotsprings", "checkered_flag", "crossed_flags", "izakaya_lantern", "moyai", "circus_tent", "performing_arts", "round_pushpin", "triangular_flag_on_post", "jp", "kr", "cn", "us", "fr", "es", "it", "ru", "gb", "uk", "de", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "keycap_ten", "1234", "zero", "hash", "symbols", "arrow_backward", "arrow_down", "arrow_forward", "arrow_left", "capital_abcd", "abcd", "abc", "arrow_lower_left", "arrow_lower_right", "arrow_right", "arrow_up", "arrow_upper_left", "arrow_upper_right", "arrow_double_down", "arrow_double_up", "arrow_down_small", "arrow_heading_down", "arrow_heading_up", "leftwards_arrow_with_hook", "arrow_right_hook", "left_right_arrow", "arrow_up_down", "arrow_up_small", "arrows_clockwise", "arrows_counterclockwise", "rewind", "fast_forward", "information_source", "ok", "twisted_rightwards_arrows", "repeat", "repeat_one", "new", "top", "up", "cool", "free", "ng", "cinema", "koko", "signal_strength", "u5272", "u5408", "u55b6", "u6307", "u6708", "u6709", "u6e80", "u7121", "u7533", "u7a7a", "u7981", "sa", "restroom", "mens", "womens", "baby_symbol", "no_smoking", "parking", "wheelchair", "metro", "baggage_claim", "accept", "wc", "potable_water", "put_litter_in_its_place", "secret", "congratulations", "m", "passport_control", "left_luggage", "customs", "ideograph_advantage", "cl", "sos", "id", "no_entry_sign", "underage", "no_mobile_phones", "do_not_litter", "non-potable_water", "no_bicycles", "no_pedestrians", "children_crossing", "no_entry", "eight_spoked_asterisk", "eight_pointed_black_star", "heart_decoration", "vs", "vibration_mode", "mobile_phone_off", "chart", "currency_exchange", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpius", "sagittarius", "capricorn", "aquarius", "pisces", "ophiuchus", "six_pointed_star", "negative_squared_cross_mark", "a", "b", "ab", "o2", "diamond_shape_with_a_dot_inside", "recycle", "end", "on", "soon", "clock1", "clock130", "clock10", "clock1030", "clock11", "clock1130", "clock12", "clock1230", "clock2", "clock230", "clock3", "clock330", "clock4", "clock430", "clock5", "clock530", "clock6", "clock630", "clock7", "clock730", "clock8", "clock830", "clock9", "clock930", "heavy_dollar_sign", "copyright", "registered", "tm", "x", "heavy_exclamation_mark", "bangbang", "interrobang", "o", "heavy_multiplication_x", "heavy_plus_sign", "heavy_minus_sign", "heavy_division_sign", "white_flower", "100", "heavy_check_mark", "ballot_box_with_check", "radio_button", "link", "curly_loop", "wavy_dash", "part_alternation_mark", "trident", "black_square", "white_square", "white_check_mark", "black_square_button", "white_square_button", "black_circle", "white_circle", "red_circle", "large_blue_circle", "large_blue_diamond", "large_orange_diamond", "small_blue_diamond", "small_orange_diamond", "small_red_triangle", "small_red_triangle_down", "shipit"];

          // ngEmbed options
          vm.options = {
              linkTarget: '_blank',
              basicVideo: false,
              code: {
                  highlight: false,
                  lineNumbers: true
              },
              gdevAuth: 'AIzaSyAQONTdSSaKwqB1X8i6dHgn9r_PtusDhq0',
              video: {
                  embed: true,
                  width: 800,
                  ytTheme: 'light',
                  details: true
              },
              tweetEmbed       : true,
              tweetOptions     : {
                  lang      : 'es'
              },
              image: {
                  embed: true
              }
          };

          // current message Id counter
          var lastMsgId = 0;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

            // focus con message text
            angular.element('#message-input').focus();

            setFlags();

            loadIntegrationConfig().then(function () {
                loadChannelMessages();
                initializeSocket();
            });

            // listen to channel updates
            $scope.$on('channelUpdated', function(event, args) {
              if (vm.isDirect) {
                return;
              }
              vm.channel = args.channel;
              setFlags();
            });
          }

          /**
           * @name loadIntegrationConfig
           * @desc loads the integration configuration for the channel
          */
          function loadIntegrationConfig() {
            return integrationService.getAll(project.id).then(function (response) {
              var integrations = response.data.integrations;
              for (var i = 0; i < integrations.length; i++) {
                var integ = integrations[i];
                var config = lodash.find(integ.configurations, 'ChannelId', channel.id);
                if (angular.isDefined(config)) {
                  config.integrationId = integ.integrationId;
                  config.integrationName = integ.name;
                  vm.integrationsConfigured.push(config);
                }
              }
            });
          }

          /**
           * @name initializeSocket
           * @desc initialize socket.io events
          */
          function initializeSocket() {

            chatService.on('reconnect', function () {
              $log.log('chat reconnect');
              chatService.emit('join-room', {
                room: getChannelRoomId()
              });
            });

            chatService.on('message', function (data) {
              $log.log('chat message received', data);
              processMessageReceived(data, addMessageToList);
              scrollToLast();
            });

            chatService.on("error", function(error) {
              $log.log('chatservice error', error);
            });

            chatService.emit('join-room', {
              room: getChannelRoomId()
            });

            $scope.$on("$destroy", function(){
              chatService.emit('leave-room', {
                room: getChannelRoomId()
              });
            });
          }

          /**
           * @name loadFlags
           * @desc sets the flags that enables/disables actions in the view
          */
          function setFlags() {

            if (vm.isDirect) {
              vm.isMember = true;
              vm.isClosed = false;
              return;
            }

            if (lodash.find(vm.channel.members, 'id', user.id) !== undefined) {
              vm.isMember = true;
            }

            vm.isClosed = (vm.channel.state === 'C' ||
                           vm.project.state === 'C');
          }

          /**
           * @name loadChannelMessages
           * @desc loads the channel message history
          */
          function loadChannelMessages() {
            var limit = 5;

            channelService.getMessages(vm.project.id, vm.channel.id, nextRequestOffset, limit, vm.isDirect).then(function (response) {
              if(response.data.messages.length === 0){
                // for the first load
                if (nextRequestOffset === 0) {
                    vm.emptyChannel = true;
                }
                vm.noMoreMessages = true;
              }
              else {
                response.data.messages.forEach(function(entry) {
                    processMessageReceived(entry, addMessageToListUnshift);
                    scrollToLast();
                });
              }
              nextRequestOffset = response.data.next_offset;
            });
          }

          /**
           * @name processMessageReceived
           * @desc process a message received on the channel
          */
          function processMessageReceived (data, addMessageToListFunction) {

            // data validation
            if (!data || !data.message) {
              $log.log('Mensaje recibido: invalido');
              return ;
            }

            var msgPayload = data.message;

            // convert server date to local date
            msgPayload.date = new Date(msgPayload.date);

            // integration types
            switch (msgPayload.type) {
              case messageType.INTEGRATION_DROPBOX:
                msgPayload.dropbox = JSON.parse(msgPayload.text);
                break;
              case messageType.INTEGRATION_GITHUB:
                msgPayload.github = JSON.parse(msgPayload.text);
                break;
              case messageType.INTEGRATION_TRELLO:
                msgPayload.trello = JSON.parse(msgPayload.text);
                break;
            }

            // add message to message list
            addMessageToListFunction(msgPayload);

            lastMsgId = msgPayload.id;
          }

          /**
           * @name sendUserMessage
           * @desc send message to the channel using the text in the input
          */
          function sendUserMessage() {
            if (vm.message.length === 0) {
              return;
            }
            sendMessage(vm.message, user.id, messageType.TEXT);
            vm.message = '';
          }

          /**
           * @name sendMessage
           * @desc sends a message to the channel
          */
          function sendMessage(messageText, authorId, type) {
            var msgPayload = buildMessageObject(messageText, authorId, type);
            sendMessageWithPayload(msgPayload);
          }

          /**
           * @name sendMessagePayload
           * @desc sends the message with the payload parameter
          */
          function sendMessageWithPayload(msgPayload) {
            // send the data to the server
            chatService.emit('message', {
              room: getChannelRoomId(),
              project_room: 'Project_' + vm.project.id,
              channel_type: vm.channel.type,
              message: {
                message: msgPayload
              }
            });

            // add the message to the view
            vm.noMoreMessages = false;
            addMessageToList(msgPayload);

            scrollToLast();
          }

          /**
           * @name buildMessageObject
           * @desc build the message payload object
          */
          function buildMessageObject(messageText, authorId, type) {

            lastMsgId++;

            var msgType = (type === undefined ? messageType.TEXT : type);

            return {
              id: lastMsgId,
              text: messageText,
              user: authorId,
              type: msgType,
              destinationUser: (isDirect ? vm.channel.id : 0),
              projectId: vm.project.id,
              date: new Date().getTime()  // for local use only, the server overwrites the date
            };
          }

          /**
           * @name scrollToLast
           * @desc scroll the window to the last message
          */
          function scrollToLast() {
            $location.hash('msg_' + lastMsgId);
            $anchorScroll();
          }

          /**
           * @name addMessageToList
           * @desc adds the message to the list so it can be viewed on the page
          */
          function addMessageToList(msg) {
            vm.messages.push(msg);
            vm.lastMessage = msg.date;
            vm.emptyChannel = false;
          }

          /**
           * @name addMessageToListUnshift
           * @desc adds the message to the top of the list so it can be viewed on the page
          */
          function addMessageToListUnshift(msg) {
            vm.messages.unshift(msg);
          }

          /**
           * @name getMember
           * @desc returns a member object by id
          */
          function getMember(message) {

            var integrationId = getIntegrationIdFromMessageType(message.type);

            switch (message.type) {
              case messageType.INTEGRATION_GITHUB:
              case messageType.INTEGRATION_TRELLO:
              case messageType.INTEGRATION_PINGDOM: {
                var config = getIntegrationConfig(message.integrationId, integrationId);
                return {
                  alias: config.name,
                  profilePicture: $rootScope.helpers.getIntegrationImage(config.integrationId)
                };
              }
              default:
                return lodash.find(vm.project.members, 'id', message.user);
            }
          }

          /**
           * @name getIntegrationIdFromMessageType
           * @desc returns the integrationId of a message type
          */
          function getIntegrationIdFromMessageType(type) {
            switch (type) {
              case messageType.INTEGRATION_GITHUB:
                return 1;
              case messageType.INTEGRATION_TRELLO:
                return 2;
              case messageType.INTEGRATION_PINGDOM:
                return 3;
            }
          }

          /**
           * @name getIntegrationConfig
           * @desc returns the configured integration
          */
          function getIntegrationConfig(integrationConfigId, integrationId) {

            for (var i = 0; i < vm.integrationsConfigured.length; i++) {
              var c = vm.integrationsConfigured[i];
              if (c.id === integrationConfigId && c.integrationId === integrationId){
                return c;
              }
            }
          }

          /**
           * @name messageIsFromUser
           * @desc returns if the message author is the logged in user
          */
          function messageIsFromUser(message) {
            return (message.user === user.id);
          }

          function getMessageClass(message) {
            var cssClass = '';
            // messages from the current logged in user
            cssClass += messageIsFromUser(message) ? 'mine' : '';

            // messsage types
            var cssType = '';
            switch (message.type) {
              case messageType.AUTO:
                cssType = 'auto';
                break;
              case messageType.FILE:
                cssType = 'file';
                break;
              case messageType.TEXT:
                cssType = 'text';
                break;
              case messageType.INTEGRATION:
                cssType = 'integration';
                break;
            }
            cssClass += ' ' + cssType;

            return cssClass;
          }

          /**
           * @name formatMessageDate
           * @desc returns the message timestamp in a readable format
          */
          function formatMessageDate (msgDate) {
            return moment(msgDate).calendar(null, {
              lastDay : '[ayer] LT',
              lastWeek : 'dddd L LT',
              sameDay : 'LT',
              sameElse : 'dddd L LT'
            });
          }

          /**
           * @name getChannelRoomId
           * @desc returns the room id used to broadcast the message
          */
          function getChannelRoomId() {
            if (isDirect) {
              // the direct channel room is put together using
              // the users id's in ascending order
              var userIdFrom = user.id,
                  userIdTo = vm.channel.id;

              if (userIdFrom > userIdTo) {
                userIdTo = userIdFrom;
                userIdFrom = vm.channel.id;
              }

              return 'Direct_' + userIdFrom + '_' + userIdTo;
            }
            else {
              return vm.channel.id;
            }
          }

          /**
           * @name canInvite
           * @desc returns if the user can add members to the channel
          */
          function canInvite () {
            if (vm.isClosed) {
              return false;
            }
            return (vm.channel.members.length < vm.project.members.length);
          }

          /**
           * @name invite
           * @desc opens the 'add channel member' dialog
          */
          function invite () {

            if (!canInvite()) {
              return;
            }

            if (!vm.isMember) {
              showAddCurrentMemberDialog();
            }
            else {
              if (vm.canInvite) {
                showAddMembersDialog();
              }
            }
          }

          /**
           * @name displayEmoji
           * @desc open/close the emoji dialog
          */
          function displayEmoji () {
            vm.showEmoji = true;
            if (vm.showEmoji) {
              $timeout(function () {
                $(document).one('click', documentClick);
              }, 50);
            }
          }

          /**
           * @name displayFileMenu
           * @desc open/close the file dialog
          */
          function displayFileMenu () {
            vm.showEmoji = false;
            $(document).off('click', documentClick);
          }

          /**
           * @name documentClick
           * @desc closes the emoji dialog en document click
          */
          function documentClick() {
            $scope.$apply(function(){
              vm.showEmoji = false;
            });
          }

          /**
           * @name setEmoji
           * @desc set the emoji symbol in the text display
          */
          function setEmoji (emoji) {
            if (vm.message === null) {
              vm.message = ' :' + emoji + ': ';
            }
            else if (vm.message.length + (emoji.length + 2) <= 500) {
              vm.message += ':' + emoji + ':';
            }
            vm.showEmoji = false;
            angular.element('#message-input').focus();
          }

          /**
           * @name addDropboxFile
           * @desc open the dropbox chooser
          */
          function addDropboxFile() {
            dropboxChooser.choose({
              // Required. Called when a user selects an item in the Chooser.
              success: function(files) {
                  var dropbox = files[0],
                      msgPayload = buildMessageObject(JSON.stringify(dropbox), user.id, messageType.INTEGRATION_DROPBOX);

                  msgPayload.dropbox = dropbox;
                  sendMessageWithPayload(msgPayload);
              }
            });
          }

          /**
           * @name showAddCurrentMemberDialog
           * @desc shows the dialog to add the current logged in user to the
           *       the channel
          */
          function showAddCurrentMemberDialog () {
            var msg = '¿Desea agregarse como participante en este canal?';
            var dlg = dialogService.showModalConfirm('Agregar canal', msg);
            dlg.result.then(function () {
              var invites = {
                members: [
                    {
                      id: user.id
                    }
                  ]
              };

              channelService.invite(vm.project.id, vm.channel.id, invites)
                .error(channelInviteError)
                .then(function (response) {
                  $rootScope.$broadcast('channelUpdated', { channel: response.data });
                  $rootScope.$broadcast('channelsUpdated');
                  ngToast.success('Canal agregado.');
                  // sends an auto generated message
                  sendMessage(user.fullName + ' se ha unido al canal.',
                              user.id,
                              messageType.AUTO);
                });
            });
          }

          /**
           * @name channelInviteError
           * @desc shows the error message to the user
          */
          function channelInviteError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }

          /**
           * @name showAddMembersDialog
           * @desc shows the dialog to add members to the channel
          */
          function showAddMembersDialog () {
            var modalInstance = $modal.open({
              templateUrl: '/src/channels/channel-invite.html',
              controller: 'ChannelInviteController',
              controllerAs: 'vm',
              size: 'md',
              backdrop: 'static',
              resolve: {
                project: function () {
                  return vm.project;
                },
                user: function () {
                  return user;
                },
                channel: function () {
                  return vm.channel;
                }
             }
           });
           modalInstance.result.then(function (updatedChannel) {
             // added members
             var added = lodash.filter(updatedChannel.members, function(m) {
               return (lodash.find(vm.channel.members, 'id', m.id) === undefined);
             });

             $rootScope.$broadcast('channelUpdated', { channel: updatedChannel });

             // sends an auto generated message for each added member
             for (var i = 0; i < added.length; i++) {
               sendMessage(added[i].fullName + ' se ha unido al canal.',
                           added[i].id,
                           messageType.AUTO);
             }
           });
          }

          /**
           * @name edit
           * @desc channel update logic
          */
          function edit () {
            var modalInstance = $modal.open({
              templateUrl: '/src/channels/channel-edit.html',
              controller: 'ChannelEditController',
              controllerAs: 'vm',
              size: 'md',
              backdrop: 'static',
              resolve: {
                project: function () {
                  return vm.project;
                },
                channel: function () {
                  return angular.copy(vm.channel);
                }
             }
           });
           modalInstance.result.then(function (updatedChannel) {
             $rootScope.$broadcast('channelUpdated', {
               channel: updatedChannel
             });
             $rootScope.$broadcast('channelsUpdated');
             // sends an auto generated message
             sendMessage('Ha editado la información del canal.',
                         user.id,
                         messageType.AUTO);
           });
          }

          /**
           * @name exit
           * @desc opens the 'exit channel' dialog
          */
          function exit () {
            var msg = '¿Desea salir del canal?';
            var dlg = dialogService.showModalConfirm('Salir de canal', msg);
            dlg.result.then(function () {
              channelService
                .deleteMember(vm.project.id, vm.channel.id, user.id)
                .then(function () {
                  sendMessage('Ha salido del canal.', user.id, messageType.AUTO);
                  ngToast.success('Has salido del canal.');
                  $rootScope.$broadcast('channelsUpdated');
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
                });
              });
          }

          /**
           * @name deleteMember
           * @desc deletes selected members from channel
          */
          function deleteMember (member) {
            var msg = '¿Esta seguro que desea eliminar el participante?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.deleteMember(vm.project.id, vm.channel.id, member.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null) {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              });
            }).then(function() {
                var index = vm.project.members.indexOf(member);
                vm.project.members.splice(index, 1);
                sendMessage('Ha salido del canal.', member.id, messageType.AUTO);
                ngToast.success('El participante ha sido eliminado.');
            });
          }

          /**
           * @name closeChannel
           * @desc calls the endpoint to close the channel
          */
          function closeChannel() {
            var msg = '¿Esta seguro que desea cerrar el canal?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.close(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                sendMessage('Ha cerrado el canal.', user.id, messageType.AUTO);
                ngToast.success('Canal cerrado.');
                $rootScope.$broadcast('channelsUpdated');
                $state.go('dashboard.project.project-explore', { id: vm.project.id });
              });
            });
          }

          /**
           * @name deleteChannel
           * @desc calls the endpoint to delete the channel
          */
          function deleteChannel() {
            var msg = '¿Esta seguro que desea eliminar el canal? Esta operación no puede revertirse.';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.deleteChannel(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                  ngToast.success('Canal eliminado.');
                  $rootScope.$broadcast('channelsUpdated');
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
              });
            });
          }

          /*
          * @name loadOlderMessages
          * @desc calls method to retrieve older messages
          */
          function loadOlderMessages(){
            if(!vm.noMoreMessages){
              loadChannelMessages();
            }
          }
      }
})();
