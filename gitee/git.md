```
#回退版本
git reset --hard HEAD^
首先，Git必须知道当前版本是哪个版本，在Git中，用HEAD表示当前版本，也就是最新的提交3628164...882e1e0（注意我的提交ID和你的肯定不一样），上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100。

#回到未来
$ git reset --hard 36281(指定版本ID)

#查看版本号
git reflog

#提交历史
git log

#撤销暂存区修改
git reset HEAD file

#撤销修改
git checkout -- file

#创建SSH Key
ssh-keygen -t rsa -C "邮箱"
id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人。

#同步到github
git remote add origin git@github.com:michaelliao/learngit.git

#推送
git push -u origin master

#ssh警告
The authenticity of host 'github.com (xx.xx.xx.xx)' can't be established.
RSA key fingerprint is xx.xx.xx.xx.xx.
Are you sure you want to continue connecting (yes/no)?

#克隆
git clone

#创建并切换
git checkout -b dev

#切换分支
git branch dev(可以用git branch查看分支)
git checkout dev

#合并某分支到当前分支：
git merge <name>

#删除分支：
git branch -d <name>

#储藏
git stash
应用储藏
git stash apply
储藏删除
git stash drop

#查看远程库信息
git remote -v

#从本地推送远端
git push origin branch-name

#检查.gitignore
git check-ignore
```