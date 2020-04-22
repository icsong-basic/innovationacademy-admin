// Layout Types
import { DefaultLayout, EmptyLayout } from "./shards-dashboard-template/layouts";

// Route Views
// import BlogOverview from "./shards-dashboard-template/views/BlogOverview";
// import AddNewPost from "./shards-dashboard-template/views/AddNewPost";
// import Errors from "./shards-dashboard-template/views/Errors";
// import ComponentsOverview from "./shards-dashboard-template/views/ComponentsOverview";
// import Tables from "./shards-dashboard-template/views/Tables";
// import BlogPosts from "./shards-dashboard-template/views/BlogPosts";
import LoginPage from "./containers/LoginPage";
import RefreshFaq from "./containers/RefreshFaq";
import NotFoundPage from "./NotFoundPage";
import LoginStatus from "./data/singleton/LoginStatus";
import ImageUpload from "./containers/ImageUpload";
import UserProfile from "./containers/UserProfile";
import MailingListPage from "./containers/MailingListPage";
import _42SeoulNews from "./containers/boards/_42SeoulNews";
import InnovationAcademyNews from "./containers/boards/InnovationAcademyNews";
import SignUpPage from "./containers/SignUpPage";
import InnovationAcademyBoard from "./containers/boards/InnovationAcademyBoard";
import ManageUsersPage from "./containers/ManageUsersPage";
import MainPage from "./containers/MainPage";
import InnovationAcademyNotice from "./containers/boards/InnovationAcademyNotice";
import _42SeoulNotice from "./containers/boards/_42SeoulNotice";
import StudentStatistics from "./containers/StudentStatistics";
import ManageStudentPage from "./containers/ManageStudentPage";
import EssayNotice from "./containers/boards/EssayNotice";
import EssayAgreementPage from "./containers/EssayAgreementPage";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: MainPage
  },
  {
    title: "Mailing List",
    path: "/mailing-list",
    exact: true,
    layout: DefaultLayout,
    component: MailingListPage,
    showInNav: () => (LoginStatus.isAdmin),
    htmlBefore: '<i class="material-icons">mail</i>',
  },
  {
    title: "Users",
    path: "/manage-users",
    exact: true,
    layout: DefaultLayout,
    component: ManageUsersPage,
    showInNav: () => (LoginStatus.isAdmin),
    htmlBefore: '<i class="material-icons">assignment_ind</i>'
  },
  {
    title: "42 Seoul News",
    path: "/42seoul-news",
    exact: false,
    layout: DefaultLayout,
    component: _42SeoulNews,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(1) || LoginStatus.hasBoardAuthority(2)
    },
    htmlBefore: '<i class="material-icons">edit</i>',
  },
  {
    title: "42 Seoul 공지사항",
    path: "/42seoul-notice-popup",
    exact: false,
    layout: DefaultLayout,
    component: _42SeoulNotice,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(7)
    },
    htmlBefore: '<i class="material-icons">edit</i>'
  },
  {
    title: "42 Seoul FAQ",
    path: "/42seoul-refresh-faq",
    exact: false,
    layout: DefaultLayout,
    component: RefreshFaq,
    showInNav: () => (LoginStatus.isAdmin || LoginStatus.isFaqUpdater),
    htmlBefore: '<i class="material-icons">sync</i>'
  },
  {
    title: "I.A Board",
    path: "/innovationacademy_board",
    exact: false,
    layout: DefaultLayout,
    component: InnovationAcademyBoard,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(3) || LoginStatus.hasBoardAuthority(4)
    },
    htmlBefore: '<i class="material-icons">edit</i>',

  },
  {

    title: "I.A News",
    path: "/innovationacademy-news",
    exact: false,
    layout: DefaultLayout,
    component: InnovationAcademyNews,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(5) || LoginStatus.hasBoardAuthority(6)
    },
    htmlBefore: '<i class="material-icons">edit</i>',
  },
  {

    title: "I.A 공지사항",
    path: "/innovationacademy-notice-popup",
    exact: false,
    layout: DefaultLayout,
    component: InnovationAcademyNotice,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(8)
    },
    htmlBefore: '<i class="material-icons">edit</i>',
  },
  {

    title: "교육생 통계",
    path: "/student-stats",
    exact: false,
    layout: DefaultLayout,
    component: StudentStatistics,
    showInNav: () => (LoginStatus.isAdmin || LoginStatus.isStudentManager),
    htmlBefore: '<i class="material-icons">insert_chart</i>',
  },
  {

    title: "교육생 관리",
    path: "/manage-student",
    exact: false,
    layout: DefaultLayout,
    component: ManageStudentPage,
    showInNav: () => (LoginStatus.isAdmin || LoginStatus.isStudentManager),
    htmlBefore: '<i class="material-icons">group</i>',
  },
  {

    title: "에세이 공지사항",
    path: "/essay-notice",
    exact: false,
    layout: DefaultLayout,
    component: EssayNotice,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(9)
    },
    htmlBefore: '<i class="material-icons">edit</i>',
  },
  {

    title: "에세이 약관",
    path: "/essay-agreement",
    exact: false,
    layout: DefaultLayout,
    component: EssayAgreementPage,
    showInNav: () => {
      return LoginStatus.hasBoardAuthority(10)
    },
    htmlBefore: '<i class="material-icons">edit</i>',
  },
  {
    path: "/login",
    exact: false,
    layout: EmptyLayout,
    component: LoginPage
  },
  {
    path: "/logout",
    exact: false,
    layout: EmptyLayout,
    component: (props) => {
      LoginStatus.logout();
      props.history.replace('/login', { redirectionGoBack: true });
      return null;
    }
  },
  {
    path: "/profile",
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/signup",
    layout: EmptyLayout,
    component: SignUpPage
  },
  {
    path: '/image-upload',
    layout: DefaultLayout,
    component: ImageUpload
  },
  {
    path: "/404",
    layout: EmptyLayout,
    component: NotFoundPage
  },
  // {
  //   path: "/blog-overview",
  //   layout: DefaultLayout,
  //   component: BlogOverview
  // },
  // {
  //   path: "/add-new-post",
  //   layout: DefaultLayout,
  //   component: AddNewPost
  // },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: ComponentsOverview
  // },
  // {
  //   path: "/tables",
  //   layout: DefaultLayout,
  //   component: Tables
  // },
  // {
  //   path: "/blog-posts",
  //   layout: DefaultLayout,
  //   component: BlogPosts
  // }

];
