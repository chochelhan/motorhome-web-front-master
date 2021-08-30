<template>
  <div class="comments-container">
    <div class="comments">
      <div v-for="comment in comments" v-bind:key="comment.id" class="uk-flex comment" v-bind:class="{'sub-comment': comment.depth > 0}">
        <div class="comment-profile">
          <profile-image src="comment.user_profile"></profile-image>
        </div>
        <div class="uk-flex-1 comment-article">
          <div class="comment-username">{{comment.user_name}}</div>
          <div v-if="editing === comment.id">
            <input v-model="comment.contents" type="text"/>
          </div>
          <div v-else class="comment-contents">
            <div v-if="comment.deleted">삭제된 댓글입니다.</div>
            <div v-else v-html="highlightMension(comment.contents)"></div>
          </div>
          <div v-if="!comment.deleted" class="uk-flex uk-flex-between">
            <div class="comment-date">{{comment.created_at | formatDate}}</div>
            <div v-if="isMine(comment)">
              <div v-if="editing === comment.id">
                <button v-on:click="update(comment)" class="uk-button uk-button-link">수정완료</button>
                <button v-on:click="cancelEdit(comment)" class="uk-button uk-button-link">취소</button>
              </div>
              <div v-else>
                <button v-on:click="edit(comment)" class="uk-button uk-button-link">수정</button>
                <button v-on:click="remove(comment)" class="uk-button uk-button-link">삭제</button>
              </div>
            </div>
            <div v-else>
              <button v-on:click="reply(comment)" class="uk-button uk-button-link">답글쓰기</button>
            </div>
          </div>
          <div v-if="replying === comment.id" class="uk-flex reply-form">
            <div class="uk-flex-1">
              <input v-model="replyContents" type="text" class="uk-input" style="height: 30px;"/>
            </div>
            <button v-on:click="writeReply" class="uk-button uk-button-primary" style="line-height: 30px; padding: 0 10px;">등록</button>
          </div>
        </div>
      </div>
    </div>
    <div class="uk-flex comment-form">
      <div class="uk-flex-1">
        <input v-model="contents" type="text" class="uk-input" style="height: 30px;"/>
      </div>
      <button v-on:click="write" class="uk-button uk-button-primary" style="line-height: 30px; padding: 0 10px;">등록</button>
    </div>
  </div>
</template>

<script>
import ProfileImage from './ProfileImage'
export default {
  name: 'LeisureDiaryComments',
  components: {
    ProfileImage
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      comments: this.value,
      replyContents: null,
      contents: null,
      editing: null,
      replying: null
    }
  },
  methods: {
    highlightMension (value) {
      return value.replace(/(@[^\s]+)/, '<strong>$1</strong>')
    },
    isMine (comment) {
      return comment.user_id === 1
    },
    edit (comment) {
      comment._originContents = comment.contents
      this.editing = comment.id
    },
    update (comment) {
      this.edieditingtable = null
    },
    remove (comment) {
      if (confirm('댓글을 삭제하시겠습니까? 삭제 내용은 복원되지 않습니다.')) {
        comment.deleted = true
        this.$forceUpdate()
      }
    },
    cancelEdit (comment) {
      comment.contents = comment._originContents
      delete comment._originContents
      this.editing = null
    },
    reply (comment) {
      this.replying = comment.id
    },
    writeReply () {
      if (this.replyContents && this.replyContents.trim().length > 0) {
        this.comments.push({
          id: 5,
          user_id: 1,
          user_name: '플레저카라반',
          contents: this.replyContents,
          created_at: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
          depth: 2
        })
        this.replyContents = null
        this.replying = null
      } else {
        this.$swal.alert('내용을 입력하세요.')
      }
    },
    write () {
      if (this.contents && this.contents.trim().length > 0) {
        this.comments.push({
          id: 5,
          user_id: 1,
          user_name: '플레저카라반',
          contents: this.contents,
          created_at: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
          depth: 0
        })
        this.contents = null
      } else {
        this.$swal.alert('내용을 입력하세요.')
      }
    }
  },
  mounted () {
    this.comments = [
      {
        id: 1,
        user_id: 1,
        user_name: '플레저카라반',
        contents: '좋은 곳을 소개 해 주셔서 감사합니다! 한번 가 보고 싶네요 기회가 된다면 정모 한번 하시죠...',
        created_at: '2020-11-01 12:12:12',
        depth: 0
      },
      {
        id: 2,
        user_id: 2,
        user_name: '달구지캠핑',
        contents: '세번째 사진은 어디인가요?',
        created_at: '2020-09-18 22:15:12',
        depth: 0
      },
      {
        id: 3,
        user_id: 1,
        user_name: '플레저카라반',
        contents: '@달구지캠핑 천안 병천 순대거리요!',
        created_at: '2020.09.18 22:15:12',
        depth: 1
      },
      {
        id: 4,
        user_id: 2,
        user_name: '달구지캠핑',
        contents: '@플레저레저캠핑 다음에 같이 가시죠! @고라니',
        created_at: '2020.09.18 22:15:12',
        depth: 1
      }
    ]
    this.$emit('input', this.comments)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

$comment-form-height: 40px;
$sub-comment-margin: 40px;

.comments-container {
  height: 100%;
  .comments {
    height: calc(100% - #{$comment-form-height});
    .comment {
      padding: $layout-margin;
      border-top: solid $global-border 1px;
      &:first-child {
        border-top: none;
      }
      &.sub-comment {
        margin-left: $sub-comment-margin;
        border-top: solid #eeeeee 1px !important;
      }
      .comment-article {
        padding-left: $layout-margin;
        .comment-username {
          font-weight: bold;
        }
        .comment-contents {
          font-size: 0.8rem;
        }
        .comment-date {
          font-size: 0.8rem;
          margin-top: $content-margin;
        }
        .reply-form {
          height: 30px;
        }
      }
    }
  }
  .comment-form {
    height: 40px;
    padding: 5px;
  }
}
</style>
