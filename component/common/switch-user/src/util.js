import ScmSdk from 'scm-sdk';

export function updateUserInfo(userInfo) {
  ScmSdk.getStore().commit('systemConfig/setUser', userInfo);
  window.sessionStorage.setItem('CURRENTEMPLOYEEINFO', JSON.stringify(userInfo));
}

export default {
  updateUserInfo,
};
