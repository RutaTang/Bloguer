module bloguer_address::bloguer{

    use std::string::String;
    use std::signer;
    use aptos_std::vector;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use std::string;


    struct PostStore has key {
        posts: vector<Post>,
    }

    struct Post has store, drop, copy {
        id: u64,
        title: String,
        description: String,
        content: String,
        publish_date: u64, //timestamp
        update_date: u64, //timestamp
        read_duration: u16, // by minute
        comments: vector<Comment>,
    }

    struct Comment has store, drop, copy {
        id: u64,
        commentor: address,
        comment_date: u64, //timestamp
        content: String,
    }

    fun init_module(account: &signer) {
        // init and move the post store to the account
        let post_store = PostStore {
            posts: vector::empty<Post>(), 
        };
        move_to(account, post_store);
    }

    public fun create_post(account: &signer, id: u64, title: String, description: String, content: String, publish_date: u64, read_duration: u16) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        let post = Post {
            id: id,
            title: title,
            description: description,
            content: content,
            publish_date: publish_date,
            update_date: publish_date,
            read_duration: read_duration,
            comments: vector::empty<Comment>(),
        };
        vector::push_back(&mut post_store.posts, post);
    }

    public fun delete_post(account: &signer, id: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.id == id)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //remove the post
        vector::remove(&mut post_store.posts, index);
    }

    public fun update_post(account: &signer, id: u64, title: String, description: String, content: String, update_date: u64, read_duration: u16) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.id == id)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //update the post
        let post = vector::borrow_mut(&mut post_store.posts, index);
        post.title = title;
        post.description = description;
        post.content = content;
        post.update_date = update_date;
        post.read_duration = read_duration;
    }

    public fun comment_on_a_post(account: &signer, post_id: u64, comment_id: u64, content: String, comment_date: u64) acquires PostStore {
        //get address of the account
        let signer_address = signer::address_of(account); 
        //get the post store
        let post_store = borrow_global_mut<PostStore>(signer_address);
        //find the post index
        let len = vector::length(&post_store.posts);
        //assert if posts is empty
        assert!(len > 0, 0);
        //find the post index
        let index = 0; 
        while (index < len) {
            let post = vector::borrow(&post_store.posts, index);
            if (post.id == post_id)  break;
            index = index + 1;
        };
        //assert if post not found
        assert!(index < len, 0);
        //comment on the post
        let post = vector::borrow_mut(&mut post_store.posts, index);
        let comment = Comment {
            id: comment_id,
            commentor: signer_address,
            comment_date: comment_date,
            content: content,
        };
        vector::push_back(&mut post.comments, comment);
    }


    #[test(admin=@0x123)]
    public fun test_create_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, 1, string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //check if posts length is 1
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 1, 0);
    }

    #[test(admin=@0x123)]
    public fun test_delete_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, 1, string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //check if posts length is 1
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 1, 0);
        //delete the post
        delete_post(&admin, 1);
        //check if posts length is 0
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        assert!(vector::length(&post_store.posts) == 0, 0);
    }

    #[test(admin=@0x123)]
    public fun test_update_post(admin: signer) acquires PostStore  {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, 1, string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //update the post
        update_post(&admin, 1, string::utf8(b"new title"), string::utf8(b"new description"), string::utf8(b"new content"), 123456789, 10);
        //check if post is updated
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        let post = vector::borrow(&post_store.posts, 0);
        assert!(post.title == string::utf8(b"new title"), 0);
        assert!(post.description == string::utf8(b"new description"), 0);
        assert!(post.content == string::utf8(b"new content"), 0);
    }

    #[test(admin=@0x123)]
    public fun test_comment_on_a_post(admin: signer) acquires PostStore {
        account::create_account_for_test(signer::address_of(&admin));
        init_module(&admin);
        create_post(&admin, 1, string::utf8(b"title"), string::utf8(b"description"), string::utf8(b"content"), 123456789, 10);
        //comment on the post
        comment_on_a_post(&admin, 1, 1, string::utf8(b"comment"), 123456789);
        //check if comment is added
        let post_store = borrow_global<PostStore>(signer::address_of(&admin));
        let post = vector::borrow(&post_store.posts, 0);
        let comment = vector::borrow(&post.comments, 0);
        assert!(comment.content == string::utf8(b"comment"), 0);
    }

}
