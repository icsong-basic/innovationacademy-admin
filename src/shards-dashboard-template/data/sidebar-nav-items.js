import constants from '../../constants';
import LoginStatus from '../../data/singleton/LoginStatus';

export default function () {
  return [
    // {
    //   title: "Program",
    //   to: "/program",
    //   htmlBefore: '<i class="material-icons">edit</i>',
    //   htmlAfter: ""
    // },
    {
      title: "Mailing List",
      to: "/mailing-list",
      htmlBefore: '<i class="material-icons">mail</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_ADMIN]
    },
    {
      title: "Users",
      to: "/manage-users",
      htmlBefore: '<i class="material-icons">assignment_ind</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_ADMIN]
    },
    {
      title: "42 Seoul News",
      to: "/42seoul-news",
      htmlBefore: '<i class="material-icons">perm_media</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_BOARD_MANAGER]
    },
    {
      title: "42 Seoul FAQ",
      to: "/42seoul-refresh-faq",
      htmlBefore: '<i class="material-icons">sync</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_ADMIN]
    },
    {
      title: "I.A Board",
      to: "/innovationacademy_board",
      htmlBefore: '<i class="material-icons">perm_media</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_BOARD_MANAGER]
    },
    {
      title: "I.A News",
      to: "/innovationacademy-news",
      htmlBefore: '<i class="material-icons">perm_media</i>',
      htmlAfter: "",
      authorities: [constants.roles.ROLE_BOARD_MANAGER]
    }
    // {
    //   title: "Image upload",
    //   to: "/image-upload",
    //   htmlBefore: '<i class="material-icons">add_a_photo</i>',
    //   htmlAfter: ""
    // },
    /*
    {
      title: "Blog Dashboard",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Blog Posts",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/blog-posts",
    },
    {
      title: "Add New Post",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/add-new-post",
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/components-overview",
    },
    {
      title: "Tables",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/tables",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/profile",
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/errors",
    }
    */
  ]
}
