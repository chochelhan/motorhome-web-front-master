<template>
    <div class="comments">
        <div class="comment-form">
            <comment-input ref="comment" v-model="commentContents" placeholder="댓글을 남겨보세요"></comment-input>
            <button v-on:click="createComment" type="button" class="comment-submit">등록</button>
        </div>
        <ul class="uk-list comment-list">
            <li v-for="comment in comments" v-bind:key="comment.commentNo"
                v-bind:class="{'comment-replying': isReplying(comment), 'comment-isreply': comment.commentNo !== comment.commentGroupNo}"
                class="comment">
                <div class="comment-container">
                    <div class="comment-profile">
                        <profile-image v-on:click.native="showProfile(comment.creatorInfo.creatorNo)"
                                       v-bind:src="comment.creatorInfo.profileImageUrl" size="43px"></profile-image>
                    </div>
                    <div class="comment-article">
                        <div class="comment-author">
                            <span>{{ comment.creatorInfo.creatorName }}</span>
                            <span v-if="comment.creatorInfo.creatorNo === creatorNo"
                                  class="comment-owner-badge">작성자</span>
                        </div>
                        <div v-if="isEditing(comment)" class="comment-contents">
                            <comment-input ref="edit" v-model="editContents"></comment-input>
                        </div>
                        <div v-else class="comment-contents">
              <span v-for="(part, index) in comment.parts" v-bind:key="index">
                <mark v-if="isMention(part)" v-on:click="profile(part)" class="comment-mention">{{ part }}</mark>
                <span v-else>{{ part }}</span>
              </span>
                        </div>
                        <div v-if="isEditing(comment)" class="comment-edit-action">
                            <button v-on:click="updateComment(comment)" type="button" class="comment-update">수정완료
                            </button>
                            <button v-on:click="cancelEdit(comment)" type="button" class="comment-cancel">취소</button>
                        </div>
                        <div v-else class="comment-extra">
                            <div class="comment-created-at">{{ comment.createdAt | formatDate }}</div>
                            <button v-on:click="replyComment(comment)" type="button" class="comment-reply">@답글쓰기
                            </button>
                            <div class="comment-action">
                                <button v-if="comment.owner" v-on:click="editComment(comment)" type="button"
                                        class="comment-edit">수정
                                </button>
                                <button v-if="comment.owner" v-on:click="deleteComment(comment)" type="button"
                                        class="comment-delete">삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isReplying(comment)" class="comment-reply-form">
                    <comment-input ref="reply" v-model="replyContents" class="comment-reply-input"></comment-input>
                    <button v-on:click="createReply" type="button" class="comment-submit">등록</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'
import CommentInput from './CommentInput'
import ProfileActivity from './activities/ProfileActivity'
import ProfileImage from './ProfileImage'

export default {
    name: 'Comments',
    components: {
        CommentInput,
        ProfileImage
    },
    props: {
        articleNo: {
            type: Number,
            required: true
        },
        creatorNo: Number
    },
    data() {
        return {
            article: null,
            comments: [],
            commentContents: null,
            editing: null,
            editContents: null,
            replying: null,
            replyContents: null,
            DEBUG:false,
        }
    },
    methods: {
        showProfile(id) {
            this.$activity.start(ProfileActivity, {
                id: id
            })
        },
        attachMention(text) {
            return text.replace(/(@[^\s]+)/, '<a href="" style="color: #16adb9 !important;">$1</a>')
        },
        isEditing(comment) {
            return this.editing && comment.commentNo === this.editing.commentNo
        },
        isReplying(comment) {
            return this.replying && comment.commentNo === this.replying.commentNo
        },
        isMention(part) {
            return /^@/.test(part)
        },
        profile(part) {
            // this.$activity.start(ProfileActivity, {})
        },
        createComment() {

            if (!this.commentContents || this.commentContents.trim().length < 1) {
                this.$swal.alert('내용을 입력해주세요.')
                return
            }
            if(this.DEBUG) {
                axios.post(`http://localhost:8651/comments`,{
                    contents: this.commentContents,
                    commentGroupNo: null,
                    mentionedMemberNo: null,
                    articleNo:this.articleNo
                }, {
                    headers: {
                        Authorization: this.$api.token
                    }
                }).then(response => {
                    console.log(response)
                    response.data.parts = this.parseContents(response.data.contents)
                    this.comments.unshift(response.data)
                    this.$refs.comment.clean()
                    this.$emit('count', this.comments.length)
                }).catch((error) => {
                    if (error.response) {
                        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                        // Node.js의 http.ClientRequest 인스턴스입니다.
                        console.log(error.request);
                    } else {
                        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                        console.log('Error', error.message);
                    }
                    console.log(error.config);

                })

            } else {
                this.$api.post(`/comments`, {
                    contents: this.commentContents,
                    commentGroupNo: null,
                    mentionedMemberNo: null,
                    articleNo: 121212 //this.articleNo
                }).then(response => {
                    response.data.parts = this.parseContents(response.data.contents)
                    this.comments.unshift(response.data)
                    this.$refs.comment.clean()
                    this.$emit('count', this.comments.length)
                })
            }
        },
        createReply() {
            let contents = this.replyContents.replace(/(@[^\s]+)/, '').replace('&nbsp;', '')
            if (!contents || contents.trim().length < 1) {
                this.$swal.alert('내용을 입력해주세요.')
                return
            }
            let targetNo = this.replying.commentGroupNo ? this.replying.commentGroupNo : this.replying.commentNo

            if(this.DEBUG) {
                axios.post(`http://localhost:8651/comments`, {
                    contents: this.replyContents,
                    commentGroupNo: targetNo,
                    mentionedMemberNo: this.replying.creatorInfo.creatorNo,
                    articleNo: this.articleNo
                }, {
                    headers: {
                        Authorization: this.$api.token
                    }
                }).then(response => {
                    response.data.parts = this.parseContents(response.data.contents)
                    let index = this.comments.findIndex(comment => targetNo === comment.commentNo)
                    this.comments.splice(index + 1, 0, response.data)
                    this.$emit('count', this.comments.length)
                    this.cancelReply()
                });
            } else {
                this.$api.post(`/comments`, {
                    contents: this.replyContents,
                    commentGroupNo: targetNo,
                    mentionedMemberNo: this.replying.creatorInfo.creatorNo,
                    articleNo: this.articleNo
                }).then(response => {
                    response.data.parts = this.parseContents(response.data.contents)
                    let index = this.comments.findIndex(comment => targetNo === comment.commentNo)
                    this.comments.splice(index + 1, 0, response.data)
                    this.$emit('count', this.comments.length)
                    this.cancelReply()
                })
            }
        },
        replyComment(comment) {
            this.replying = comment
            this.replyContents = '@' + comment.creatorInfo.creatorName + '&nbsp;'
        },
        editComment(comment) {
            this.editing = comment
            this.editContents = comment.contents
        },
        updateComment(comment) {
            let contents = this.editContents.replace(/(@[^\s]+)/, '').replace('&nbsp;', '')
            if (!contents || contents.trim().length < 1) {
                this.$swal.alert('내용을 입력해주세요.')
                return
            }
            comment.contents = this.editContents
            this.$api.put(`/comments/${comment.commentNo}`, {
                contents: this.editContents,
                commentGroupNo: null,
                mentionedMemberNo: comment.creatorInfo.creatorNo,
                articleNo: this.articleNo
            }).then(response => {
                comment.contents = this.editContents
                comment.parts = this.parseContents(comment.contents)
                this.editing = null
                this.editContents = null
            })
        },
        deleteComment(comment) {
            this.$swal.confirm('댓글을 삭제하시겠습니까?\n삭제한 댓글은 되돌릴 수 없습니다.').then(() => {
                this.$api.delete(`/comments/${comment.commentNo}`).then(response => {
                    this.search()
                })
            })
        },
        cancelEdit(comment) {
            this.editing = null
            this.editContents = null
        },
        cancelReply(reply) {
            if (this.$refs.reply.length > 0) {
                this.$refs.reply[0].clean()
            } else {
                this.$refs.reply.clean()
            }
            this.replying = null
        },
        parseContents(contents) {
            let parts = ['']
            contents.split(/\s/).forEach(word => {
                if (/^@.+/.test(word)) {
                    parts.push(word)
                    parts.push('')
                } else {
                    parts[parts.length - 1] += ' ' + word
                }
            })
            return parts.map(part => part.trim()).filter(part => part.length)
        },
        search(page = 1) {
            this.$api.get(`/comments`, {
                params: {
                    page: page,
                    size: 10,
                    articleNo: this.articleNo
                }
            }).then(response => {
                this.comments = []
                response.data.forEach(comment => {
                    comment.parts = this.parseContents(comment.contents)
                    this.comments.push(comment)
                })
                this.$emit('count', this.comments.length)
            })
        }
    },
    created() {
        this.search()
        if(location.hostname=='localhost') {
            this.DEBUG = true;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.comments {
    flex-grow: 1;
    background-color: #ffffff;

    .comment-input {
        display: block;
        flex-grow: 1;
        background-color: #f1f1f1;
        border: none;
        color: #8a92a5;
        padding: 14px 11px;
        font-size: 0.75rem;
        font-weight: normal;

        &:focus {
            outline: none;
        }
    }

    .comment-replying {
        .comment-reply {
            color: #16adb9 !important;
            font-weight: bold;
        }
    }

    .comment-form {
        padding: 10px 21px 0;
        display: flex;
    }

    .comment-submit {
        border: none;
        background-color: #16adb9;
        color: #ffffff;
        font-size: 0.85rem;
        padding: 0 15px;
    }

    .comment-list {
        margin: 0;

        .comment {
            padding: 10px 21px;
            border-bottom: solid #bcbcbc 1px;

            &.comment-isreply {
                padding-left: 40px;
            }

            &::before {
                display: none;
            }

            &:last-child {
                border-bottom: none;
            }

            .comment-container {
                display: flex;

                .comment-profile {
                    width: 43px;
                    height: 43px;
                }

                .comment-article {
                    flex-grow: 1;
                    font-size: 0.75rem;
                    margin-left: 6px;

                    .comment-author {
                        color: #000000;
                        font-weight: bold;
                        font-size: 0.85rem;

                        .comment-owner-badge {
                            font-size: 0.7rem;
                            border: solid #16adb9 1px;
                            border-radius: 10px;
                            color: #16adb9;
                            padding: 0 5px;
                            font-weight: normal;
                            margin-left: 2px;
                        }
                    }

                    .comment-contents {
                        .comment-edit-form {
                            width: 100%;
                            background-color: #f1f1f1;
                            border: none;
                            color: #8a92a5;
                            padding: 8px;
                            font-size: 0.75rem;
                            font-weight: normal;
                        }

                        .comment-mention {
                            color: $global-primary-color;
                            cursor: pointer;
                        }
                    }

                    .comment-edit-action {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;

                        button {
                            cursor: pointer;
                            border: none;
                            background-color: transparent;
                            word-break: keep-all;
                            color: #16adb9;
                        }
                    }
                }

                .comment-extra {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 3px;
                    color: #969696;

                    .comment-created-at {
                        width: 100px;
                    }

                    button {
                        cursor: pointer;
                        border: none;
                        background-color: transparent;
                        word-break: keep-all;
                        color: #969696;
                    }

                    .comment-reply {
                        text-align: center;
                        width: 80px;
                        font-size: 0.75rem;
                    }

                    .comment-action {
                        display: flex;
                        justify-content: flex-end;
                        flex-grow: 1;
                        text-align: center;

                        .comment-edit {
                            font-size: 0.75rem;
                        }

                        .comment-delete {
                            font-size: 0.75rem;
                        }
                    }
                }
            }

            .comment-reply-form {
                display: flex;
                margin-top: 10px;

                .comment-reply-input {
                    flex-grow: 1;
                }
            }
        }
    }
}

.comment-mention {
    &::after {
        content: ' ';
    }
}
</style>
