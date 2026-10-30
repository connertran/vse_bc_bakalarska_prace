-- PostgreSQL schema.
-- ID columns are BIGINT GENERATED ALWAYS AS IDENTITY.
-- Yes/no flags are BOOLEAN. VARCHAR2 is VARCHAR. NUMBER(19) is BIGINT.

CREATE TABLE availability_slot 
    ( 
     ID                  BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     start_time          TIMESTAMP WITH TIME ZONE  NOT NULL , 
     end_time            TIMESTAMP WITH TIME ZONE  NOT NULL , 
     location_preference VARCHAR(255)  NOT NULL , 
     address             VARCHAR(255)  NOT NULL , 
     user_ID             BIGINT  NOT NULL 
    ) 
;

ALTER TABLE availability_slot 
    ADD CONSTRAINT availability_slot_PK PRIMARY KEY ( ID ) ;

CREATE TABLE chat 
    ( 
     ID BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL 
    ) 
;

ALTER TABLE chat 
    ADD CONSTRAINT chat_PK PRIMARY KEY ( ID ) ;

CREATE TABLE communicate 
    ( 
     user_ID BIGINT  NOT NULL , 
     chat_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE communicate 
    ADD CONSTRAINT communicate_PK PRIMARY KEY ( user_ID, chat_ID ) ;

CREATE TABLE course 
    ( 
     ID           BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     course_code  VARCHAR(20)  NOT NULL , 
     name         VARCHAR(155)  NOT NULL , 
     description  VARCHAR(255) , 
     syllabus_URL VARCHAR(255)  NOT NULL , 
     is_active    BOOLEAN  NOT NULL DEFAULT TRUE, 
     faculty_ID   BIGINT  NOT NULL 
    ) 
;

ALTER TABLE course 
    ADD CONSTRAINT course_PK PRIMARY KEY ( ID ) ;

CREATE TABLE faculty 
    ( 
     ID            BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     name          VARCHAR(155)  NOT NULL , 
     university_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE faculty 
    ADD CONSTRAINT faculty_PK PRIMARY KEY ( ID ) ;

CREATE TABLE field_of_study 
    ( 
     ID         BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     name       VARCHAR(155)  NOT NULL , 
     faculty_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE field_of_study 
    ADD CONSTRAINT field_of_study_PK PRIMARY KEY ( ID ) ;

CREATE TABLE help_request 
    ( 
     ID          BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     title       VARCHAR(255)  NOT NULL , 
     description VARCHAR(255)  NOT NULL , 
     budget      NUMERIC(10,2) , 
     urgency     VARCHAR(20) , 
     status      VARCHAR(20)  NOT NULL , 
     deadline    TIMESTAMP WITH TIME ZONE  NOT NULL , 
     created_at  TIMESTAMP WITH TIME ZONE  NOT NULL , 
     updated_at  TIMESTAMP WITH TIME ZONE  NOT NULL , 
     user_ID     BIGINT  NOT NULL 
    ) 
;

ALTER TABLE help_request 
    ADD CONSTRAINT help_request_PK PRIMARY KEY ( ID ) ;

CREATE TABLE help_request_course 
    ( 
     help_request_ID BIGINT  NOT NULL , 
     course_ID       BIGINT  NOT NULL 
    ) 
;

ALTER TABLE help_request_course 
    ADD CONSTRAINT help_request_course_PK PRIMARY KEY ( help_request_ID, course_ID ) ;

CREATE TABLE message 
    ( 
     ID      BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     content VARCHAR(4000)  NOT NULL , 
     is_read BOOLEAN  NOT NULL DEFAULT FALSE, 
     sent_at TIMESTAMP WITH TIME ZONE  NOT NULL , 
     chat_ID BIGINT  NOT NULL , 
     user_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE message 
    ADD CONSTRAINT message_PK PRIMARY KEY ( ID ) ;

CREATE TABLE notification 
    ( 
     ID         BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     type       VARCHAR(20)  NOT NULL , 
     content    VARCHAR(255)  NOT NULL , 
     created_at TIMESTAMP WITH TIME ZONE  NOT NULL , 
     is_read    BOOLEAN  NOT NULL DEFAULT FALSE, 
     user_ID    BIGINT  NOT NULL 
    ) 
;

ALTER TABLE notification 
    ADD CONSTRAINT notification_PK PRIMARY KEY ( ID ) ;

CREATE TABLE offer 
    ( 
     message         VARCHAR(255)  NOT NULL , 
     proposed_price  NUMERIC(10,2)  NOT NULL , 
     status          VARCHAR(20)  NOT NULL , 
     created_at      TIMESTAMP WITH TIME ZONE  NOT NULL , 
     user_ID         BIGINT  NOT NULL , 
     help_request_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE offer 
    ADD CONSTRAINT offer_PK PRIMARY KEY ( user_ID, help_request_ID ) ;

CREATE TABLE review 
    ( 
     ID               BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     overall_rating   SMALLINT  NOT NULL , 
     "comment"        VARCHAR(255) , 
     role             VARCHAR(155)  NOT NULL , 
     created_at       TIMESTAMP WITH TIME ZONE  NOT NULL , 
     session_event_ID BIGINT  NOT NULL , 
     reviewee_ID      BIGINT  NOT NULL , 
     reviewer_ID      BIGINT  NOT NULL 
    ) 
;

COMMENT ON COLUMN review.role IS 'provider vs requester' 
;

ALTER TABLE review 
    ADD CONSTRAINT review_PK PRIMARY KEY ( ID ) ;

CREATE TABLE session_event 
    ( 
     ID                   BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     scheduled_date_time  TIMESTAMP WITH TIME ZONE  NOT NULL , 
     duration             SMALLINT  NOT NULL , 
     location_preference  VARCHAR(20)  NOT NULL , 
     address              VARCHAR(20) , 
     language             VARCHAR(20) , 
     status               VARCHAR(20)  NOT NULL , 
     requester_confirm_at TIMESTAMP WITH TIME ZONE , 
     provider_confirm_at  TIMESTAMP WITH TIME ZONE , 
     completed_at         TIMESTAMP WITH TIME ZONE , 
     updated_at           TIMESTAMP WITH TIME ZONE  NOT NULL , 
     help_request_ID      BIGINT  NOT NULL 
    ) 
;

COMMENT ON COLUMN session_event.duration IS 'in min' 
;

ALTER TABLE session_event 
    ADD CONSTRAINT session_event_PK PRIMARY KEY ( ID ) ;

CREATE TABLE session_participant 
    ( 
     role                    VARCHAR(155)  NOT NULL , 
     completion_confirmed_at TIMESTAMP WITH TIME ZONE , 
     user_ID                 BIGINT  NOT NULL , 
     session_event_ID        BIGINT  NOT NULL 
    ) 
;

ALTER TABLE session_participant 
    ADD CONSTRAINT session_participant_PK PRIMARY KEY ( user_ID, session_event_ID ) ;

CREATE TABLE slots_chosen 
    ( 
     user_ID              BIGINT  NOT NULL , 
     availability_slot_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE slots_chosen 
    ADD CONSTRAINT slots_chosen_PK PRIMARY KEY ( user_ID, availability_slot_ID ) ;

CREATE TABLE university 
    ( 
     ID           BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     name         VARCHAR(155)  NOT NULL , 
     email_domain VARCHAR(155)  NOT NULL 
    ) 
;

ALTER TABLE university 
    ADD CONSTRAINT university_PK PRIMARY KEY ( ID ) ;

CREATE TABLE "user" 
    ( 
     ID                       BIGINT GENERATED ALWAYS AS IDENTITY  NOT NULL , 
     name                     VARCHAR(150)  NOT NULL , 
     email                    VARCHAR(255)  NOT NULL , 
     alt_email                VARCHAR(255)  NOT NULL , 
     email_verified           BOOLEAN  NOT NULL DEFAULT FALSE, 
     alt_email_verified       BOOLEAN  NOT NULL DEFAULT FALSE, 
     hashed_password          VARCHAR(255)  NOT NULL , 
     role                     VARCHAR(30)  NOT NULL DEFAULT 'user', 
     tel_number               VARCHAR(20) , 
     profile_pic              VARCHAR(2048) , 
     bio                      VARCHAR(2000) , 
     year_of_study            SMALLINT , 
     email_visible            BOOLEAN  NOT NULL DEFAULT TRUE, 
     alt_email_visible        BOOLEAN  NOT NULL DEFAULT TRUE, 
     tel_number_visible       BOOLEAN  NOT NULL DEFAULT TRUE, 
     hourly_rate              NUMERIC(10,2) , 
     verify_token             VARCHAR(255) , 
     verify_token_expire      TIMESTAMP WITH TIME ZONE , 
     alt_verify_token         VARCHAR(255) , 
     alt_verify_token_expire  TIMESTAMP WITH TIME ZONE , 
     forgot_pass_token        VARCHAR(255) , 
     forgot_pass_token_expire TIMESTAMP WITH TIME ZONE , 
     university_ID            BIGINT 
    ) 
;

ALTER TABLE "user" 
    ADD CONSTRAINT user_PK PRIMARY KEY ( ID ) ;

ALTER TABLE "user" 
    ADD CONSTRAINT user_email_UN UNIQUE ( email ) ;

ALTER TABLE "user" 
    ADD CONSTRAINT user_alt_email_UN UNIQUE ( alt_email ) ;

CREATE TABLE user_course 
    ( 
     course_status            VARCHAR(155)  NOT NULL , 
     confidence_in_explaining SMALLINT  NOT NULL , 
     fav_topics               VARCHAR(255) , 
     notification_enabled     BOOLEAN  NOT NULL DEFAULT TRUE, 
     user_ID                  BIGINT  NOT NULL , 
     course_ID                BIGINT  NOT NULL 
    ) 
;

ALTER TABLE user_course 
    ADD CONSTRAINT user_course_PK PRIMARY KEY ( user_ID, course_ID ) ;

CREATE TABLE user_faculty 
    ( 
     user_ID    BIGINT  NOT NULL , 
     faculty_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE user_faculty 
    ADD CONSTRAINT study_in_PK PRIMARY KEY ( user_ID, faculty_ID ) ;

CREATE TABLE user_field_of_study 
    ( 
     user_ID           BIGINT  NOT NULL , 
     field_of_study_ID BIGINT  NOT NULL 
    ) 
;

ALTER TABLE user_field_of_study 
    ADD CONSTRAINT studyv2_PK PRIMARY KEY ( user_ID, field_of_study_ID ) ;

ALTER TABLE availability_slot 
    ADD CONSTRAINT availability_slot_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE communicate 
    ADD CONSTRAINT communicate_chat_FK FOREIGN KEY 
    ( 
     chat_ID
    ) 
    REFERENCES chat 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE communicate 
    ADD CONSTRAINT communicate_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE course 
    ADD CONSTRAINT course_faculty_FK FOREIGN KEY 
    ( 
     faculty_ID
    ) 
    REFERENCES faculty 
    ( 
     ID
    ) 
;

ALTER TABLE faculty 
    ADD CONSTRAINT faculty_university_FK FOREIGN KEY 
    ( 
     university_ID
    ) 
    REFERENCES university 
    ( 
     ID
    ) 
;

ALTER TABLE field_of_study 
    ADD CONSTRAINT field_of_study_faculty_FK FOREIGN KEY 
    ( 
     faculty_ID
    ) 
    REFERENCES faculty 
    ( 
     ID
    ) 
;

ALTER TABLE help_request 
    ADD CONSTRAINT help_request_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE help_request_course 
    ADD CONSTRAINT hr_course_course_FK FOREIGN KEY 
    ( 
     course_ID
    ) 
    REFERENCES course 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE help_request_course 
    ADD CONSTRAINT hr_course_request_FK FOREIGN KEY 
    ( 
     help_request_ID
    ) 
    REFERENCES help_request 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE message 
    ADD CONSTRAINT message_chat_FK FOREIGN KEY 
    ( 
     chat_ID
    ) 
    REFERENCES chat 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE message 
    ADD CONSTRAINT message_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE notification 
    ADD CONSTRAINT notification_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE offer 
    ADD CONSTRAINT offer_help_request_FK FOREIGN KEY 
    ( 
     help_request_ID
    ) 
    REFERENCES help_request 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE offer 
    ADD CONSTRAINT offer_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE session_participant 
    ADD CONSTRAINT participant_session_FK FOREIGN KEY 
    ( 
     session_event_ID
    ) 
    REFERENCES session_event 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE review 
    ADD CONSTRAINT review_session_event_FK FOREIGN KEY 
    ( 
     session_event_ID
    ) 
    REFERENCES session_event 
    ( 
     ID
    ) 
;

ALTER TABLE review 
    ADD CONSTRAINT review_user_FK FOREIGN KEY 
    ( 
     reviewer_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE review 
    ADD CONSTRAINT review_user_FKv1 FOREIGN KEY 
    ( 
     reviewee_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE session_event 
    ADD CONSTRAINT session_event_help_request_FK FOREIGN KEY 
    ( 
     help_request_ID
    ) 
    REFERENCES help_request 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE session_participant 
    ADD CONSTRAINT session_participant_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE slots_chosen 
    ADD CONSTRAINT slots_chosen_availability_FK FOREIGN KEY 
    ( 
     availability_slot_ID
    ) 
    REFERENCES availability_slot 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE slots_chosen 
    ADD CONSTRAINT slots_chosen_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE user_faculty 
    ADD CONSTRAINT study_in_faculty_FK FOREIGN KEY 
    ( 
     faculty_ID
    ) 
    REFERENCES faculty 
    ( 
     ID
    ) 
;

ALTER TABLE user_faculty 
    ADD CONSTRAINT study_in_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE user_field_of_study 
    ADD CONSTRAINT studyv2_field_of_study_FK FOREIGN KEY 
    ( 
     field_of_study_ID
    ) 
    REFERENCES field_of_study 
    ( 
     ID
    ) 
;

ALTER TABLE user_field_of_study 
    ADD CONSTRAINT studyv2_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
;

ALTER TABLE user_course 
    ADD CONSTRAINT user_course_course_FK FOREIGN KEY 
    ( 
     course_ID
    ) 
    REFERENCES course 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE user_course 
    ADD CONSTRAINT user_course_user_FK FOREIGN KEY 
    ( 
     user_ID
    ) 
    REFERENCES "user" 
    ( 
     ID
    ) 
    ON DELETE CASCADE 
;

ALTER TABLE "user" 
    ADD CONSTRAINT user_university_FK FOREIGN KEY 
    ( 
     university_ID
    ) 
    REFERENCES university 
    ( 
     ID
    ) 
;
